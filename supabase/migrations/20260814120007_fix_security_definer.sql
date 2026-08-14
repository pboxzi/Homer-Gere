-- ============================================================
-- PHASE 1: Security fixes
-- Revoke EXECUTE from anon on SECURITY DEFINER functions
-- These functions should only be callable by authenticated users
-- ============================================================

-- Revoke from anon role (anonymous/unauthenticated users)
REVOKE EXECUTE ON FUNCTION create_audit_log(UUID, TEXT, TEXT, UUID, JSONB, JSONB, TEXT, TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION handle_registration_approval() FROM anon;
REVOKE EXECUTE ON FUNCTION is_admin_or_super() FROM anon;
REVOKE EXECUTE ON FUNCTION is_member() FROM anon;
REVOKE EXECUTE ON FUNCTION is_super_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION update_updated_at() FROM anon;
REVOKE EXECUTE ON FUNCTION generate_application_number() FROM anon;
REVOKE EXECUTE ON FUNCTION record_application_status_history() FROM anon;
REVOKE EXECUTE ON FUNCTION set_notification_read_at() FROM anon;
REVOKE EXECUTE ON FUNCTION update_payments_updated_at() FROM anon;
REVOKE EXECUTE ON FUNCTION has_permission(UUID, TEXT) FROM anon;

-- Grant EXECUTE to authenticated role (logged-in users)
GRANT EXECUTE ON FUNCTION create_audit_log(UUID, TEXT, TEXT, UUID, JSONB, JSONB, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION handle_registration_approval() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin_or_super() TO authenticated;
GRANT EXECUTE ON FUNCTION is_member() TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION has_permission(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_application_number() TO authenticated;
GRANT EXECUTE ON FUNCTION record_application_status_history() TO authenticated;
GRANT EXECUTE ON FUNCTION set_notification_read_at() TO authenticated;
GRANT EXECUTE ON FUNCTION update_payments_updated_at() TO authenticated;

-- Also grant to service_role for admin operations
GRANT EXECUTE ON FUNCTION has_permission(UUID, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION create_audit_log(UUID, TEXT, TEXT, UUID, JSONB, JSONB, TEXT, TEXT) TO service_role;
