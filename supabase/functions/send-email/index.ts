import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Homer Gere <noreply@homergere.com>";
const SITE_URL = Deno.env.get("SITE_URL") || "https://homergere.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: simple in-memory store
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 emails per minute per recipient

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(email);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(email, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// Replace {{variable}} placeholders in template
function renderTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replaceAll(`{{${key}}}`, value ?? "");
  }
  return result;
}

// Branded email wrapper
function wrapInBrandedTemplate(content: string, previewText?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Homer Gere</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FAF9F7; font-family: 'Georgia', 'Times New Roman', serif; }
    .wrapper { background-color: #FAF9F7; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .header { background-color: #1C1917; padding: 32px 40px; text-align: center; }
    .logo-text { color: #FFFFFF; font-size: 24px; letter-spacing: 0.12em; font-family: 'Georgia', serif; margin: 0; }
    .logo-sub { color: #A6852F; font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; margin-top: 6px; }
    .content { padding: 40px; color: #1C1917; line-height: 1.7; font-size: 15px; }
    .content h1 { font-size: 24px; font-weight: normal; margin: 0 0 20px; color: #1C1917; }
    .content p { margin: 0 0 16px; color: #57534E; }
    .content a { color: #A6852F; text-decoration: none; }
    .btn { display: inline-block; background-color: #A6852F; color: #FFFFFF !important; padding: 14px 32px; border-radius: 50px; font-size: 14px; font-weight: 600; letter-spacing: 0.02em; text-decoration: none !important; margin: 16px 0; }
    .btn:hover { background-color: #8B6F1F; }
    .divider { border: none; border-top: 1px solid #E8E5DF; margin: 32px 0; }
    .footer { padding: 32px 40px; text-align: center; border-top: 1px solid #E8E5DF; }
    .footer p { font-size: 12px; color: #A8A29E; margin: 0 0 8px; }
    .footer a { color: #A6852F; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .container { margin: 0 10px; }
      .content { padding: 24px; }
      .header { padding: 24px; }
      .footer { padding: 24px; }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}</div>` : ""}
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <p class="logo-text">HOMER GERE</p>
        <p class="logo-sub">Official Platform</p>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Homer Gere Official. All rights reserved.</p>
        <p><a href="${SITE_URL}">Visit Website</a> &middot; <a href="${SITE_URL}/dashboard/settings">Email Preferences</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the request is from an authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { to, templateName, variables = {}, subject: overrideSubject, html: overrideHtml, text: overrideText } = body;

    if (!to || !templateName) {
      return new Response(
        JSON.stringify({ error: "Missing 'to' or 'templateName'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit check
    if (!checkRateLimit(to)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch template from database
    const { data: template, error: tplError } = await supabase
      .from("email_templates")
      .select("*")
      .eq("name", templateName)
      .eq("is_active", true)
      .single();

    if (tplError || !template) {
      return new Response(
        JSON.stringify({ error: `Template '${templateName}' not found or inactive` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Render template with variables
    const subject = overrideSubject || renderTemplate(template.subject, variables);
    const htmlBody = overrideHtml || renderTemplate(template.html_body, variables);
    const textBody = overrideText || (template.text_body ? renderTemplate(template.text_body, variables) : undefined);

    // Wrap in branded template
    const fullHtml = wrapInBrandedTemplate(htmlBody, subject);

    // Send via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html: fullHtml,
        text: textBody,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      // Log failed send
      await supabase.from("audit_logs").insert({
        user_id: user.id,
        action: "email_send_failed",
        table_name: "email_templates",
        record_id: template.id,
        new_data: { to, template: templateName, error: resendData },
      }).catch(() => {});

      return new Response(
        JSON.stringify({ error: "Failed to send email", details: resendData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log successful send
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "email_sent",
      table_name: "email_templates",
      record_id: template.id,
      new_data: { to, template: templateName, resend_id: resendData.id, subject },
    }).catch(() => {});

    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", message: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
