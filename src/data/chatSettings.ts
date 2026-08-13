import { ChatSettings, ChatConversation } from '../types';

export const CHAT_SETTINGS: ChatSettings = {
  fanChat: {
    enabled: true,
    whatsappEnabled: true,
    whatsappNumber: '1234567890',
    requiredTierForWhatsApp: 'gold',
  },
  businessChat: {
    whatsappEnabled: true,
    emailEnabled: true,
    telegramEnabled: true,
    websiteFormEnabled: true,
    managementEmail: 'management@homergere.com',
    managementWhatsApp: '1234567890',
    telegramAccount: '@homergere',
  },
};

export const ENQUIRY_TYPES = [
  'Brand Partnership',
  'Film Opportunity',
  'Media Request',
  'Licensing',
  'Charity',
  'Speaking Engagement',
  'Commercial Collaboration',
  'Management Enquiry',
];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [];
