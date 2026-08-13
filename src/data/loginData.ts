export interface SocialProvider {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  color: string;
}

export interface LoginConfig {
  registrationEnabled: boolean;
  socialProviders: SocialProvider[];
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumber: boolean;
    requireSpecial: boolean;
  };
  mfaEnabled: boolean;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

export const LOGIN_CONFIG: LoginConfig = {
  registrationEnabled: true,
  socialProviders: [
    { id: 'google', name: 'Google', icon: 'Chrome', enabled: true, color: '#4285F4' },
    { id: 'apple', name: 'Apple', icon: 'Apple', enabled: true, color: '#000000' },
    { id: 'microsoft', name: 'Microsoft', icon: 'LayoutGrid', enabled: true, color: '#00A4EF' },
  ],
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecial: true,
  },
  mfaEnabled: false,
  maxLoginAttempts: 5,
  lockoutDuration: 900,
};

export const LOGIN_SECURITY_NOTICE = 'Your account is protected with industry-standard encryption and security monitoring. We never store your password in plain text and all sessions are securely managed.';
