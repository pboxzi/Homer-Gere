export interface RegisterConfig {
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  usernameRequired: boolean;
  phoneRequired: boolean;
  dateOfBirthRequired: boolean;
  profilePhotoEnabled: boolean;
  defaultRole: 'member' | 'pending';
  autoApproval: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumber: boolean;
    requireSpecial: boolean;
  };
}

export const REGISTER_CONFIG: RegisterConfig = {
  registrationEnabled: true,
  emailVerificationRequired: true,
  usernameRequired: false,
  phoneRequired: false,
  dateOfBirthRequired: true,
  profilePhotoEnabled: true,
  defaultRole: 'pending',
  autoApproval: false,
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecial: true,
  },
};

export const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Japan', 'Brazil', 'India', 'South Korea', 'Italy', 'Spain',
  'Mexico', 'Netherlands', 'Sweden', 'Other',
];

export const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Japanese', 'Portuguese',
  'Chinese', 'Korean', 'Italian', 'Dutch', 'Other',
];

export const TIMEZONES = [
  'Pacific Time (PT)',
  'Mountain Time (MT)',
  'Central Time (CT)',
  'Eastern Time (ET)',
  'UTC',
  'GMT',
  'Central European Time (CET)',
  'Japan Standard Time (JST)',
  'Australian Eastern Time (AET)',
  'Other',
];

export const REGISTER_TERMS = {
  termsOfService: 'By creating an account, you agree to our Terms of Service which outline the rules and guidelines for using the platform.',
  privacyPolicy: 'Our Privacy Policy explains how we collect, use, and protect your personal information.',
  communityGuidelines: 'Our Community Guidelines ensure a safe, respectful, and positive environment for all members.',
};
