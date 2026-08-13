import { FAQItem } from '../types';

export interface ContactDepartment {
  id: string;
  name: string;
  description: string;
  email: string;
  phone?: string;
  officeHours: string;
  responseTime: string;
  icon: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  country: string;
  subject: string;
  department: string;
  message: string;
  attachment?: File | null;
}

export const CONTACT_DEPARTMENTS: ContactDepartment[] = [
  {
    id: 'general',
    name: 'General Enquiries',
    description: 'General questions and information requests about Homer Gere.',
    email: 'info@homergere.com',
    phone: '+1 (310) 555-0100',
    officeHours: 'Mon – Fri, 9:00 AM – 6:00 PM PST',
    responseTime: '1–2 business days',
    icon: 'Mail',
  },
  {
    id: 'media',
    name: 'Media & Press',
    description: 'Interview requests, press kits, and media collaborations.',
    email: 'press@homergere.com',
    officeHours: 'Mon – Fri, 9:00 AM – 6:00 PM PST',
    responseTime: '1–3 business days',
    icon: 'Newspaper',
  },
  {
    id: 'partnerships',
    name: 'Brand Partnerships',
    description: 'Sponsorships, endorsements, and brand collaboration opportunities.',
    email: 'partnerships@homergere.com',
    officeHours: 'Mon – Fri, 9:00 AM – 6:00 PM PST',
    responseTime: '3–5 business days',
    icon: 'Handshake',
  },
  {
    id: 'film',
    name: 'Film & Television',
    description: 'Casting inquiries, script submissions, and production opportunities.',
    email: 'film@homergere.com',
    officeHours: 'Mon – Fri, 9:00 AM – 6:00 PM PST',
    responseTime: '3–5 business days',
    icon: 'Clapperboard',
  },
  {
    id: 'events',
    name: 'Events & Appearances',
    description: 'Booking requests for events, premieres, and public appearances.',
    email: 'events@homergere.com',
    officeHours: 'Mon – Fri, 9:00 AM – 6:00 PM PST',
    responseTime: '2–5 business days',
    icon: 'Calendar',
  },
  {
    id: 'charity',
    name: 'Charity Requests',
    description: 'Donations, charity appearances, and nonprofit partnerships.',
    email: 'charity@homergere.com',
    officeHours: 'Mon – Fri, 9:00 AM – 6:00 PM PST',
    responseTime: '5–10 business days',
    icon: 'Heart',
  },
  {
    id: 'support',
    name: 'Technical Support',
    description: 'Website issues, account problems, and technical assistance.',
    email: 'support@homergere.com',
    officeHours: 'Mon – Fri, 9:00 AM – 6:00 PM PST',
    responseTime: '1–2 business days',
    icon: 'Headphones',
  },
];

export const CONTACT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I request an interview or press feature?',
    answer: 'Please submit your request through the Media & Press department. Include your publication name, deadline, and topic of interest. Our team will review and respond within 1–3 business days.',
  },
  {
    id: 'faq-2',
    question: 'Can I request Homer for a personal appearance?',
    answer: 'Yes. Submit a request through the Events & Appearances department with details about the event, date, location, and expected audience. All appearances are subject to availability and approval.',
  },
  {
    id: 'faq-3',
    question: 'How do I submit a script or casting inquiry?',
    answer: 'Script submissions and casting inquiries should be directed to the Film & Television department. Please include the project title, synopsis, and your role in the production.',
  },
  {
    id: 'faq-4',
    question: 'Does Homer accept charity requests?',
    answer: 'Homer is committed to supporting meaningful causes. Submit your charity request through the appropriate department with details about the organization, event, and how Homer\'s involvement would make an impact.',
  },
  {
    id: 'faq-5',
    question: 'What is the expected response time?',
    answer: 'Response times vary by department. General enquiries and technical support typically receive a response within 1–2 business days. Specialized departments like Film & Television may take 3–5 business days.',
  },
  {
    id: 'faq-6',
    question: 'Is there a way to connect directly with Homer?',
    answer: 'For personal fan conversations, use the Chat with Homer page. For official business enquiries, please route through the appropriate department above.',
  },
];

export const CONTACT_OFFICE = {
  address: '',
  city: 'Los Angeles, California',
  timezone: 'Pacific Time (PT)',
  businessHours: 'Monday – Friday, 9:00 AM – 6:00 PM',
  note: 'Office visits are by appointment only.',
};

export const CONTACT_SUBJECTS = [
  'General Enquiry',
  'Interview Request',
  'Partnership Opportunity',
  'Casting / Film Inquiry',
  'Event Booking',
  'Charity Request',
  'Technical Support',
  'Press / Media',
  'Other',
];

export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Brazil',
  'India',
  'South Korea',
  'Italy',
  'Spain',
  'Mexico',
  'Netherlands',
  'Sweden',
  'Other',
];
