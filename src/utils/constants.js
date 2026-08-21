export const APP_NAME = 'AstroNarhari Partner';

export const ONBOARDING_STEPS = [
  {
    key: 'personal',
    label: 'Personal Details',
    path: '/onboarding/personal-details',
  },
  {
    key: 'professional',
    label: 'Professional Details',
    path: '/onboarding/professional-details',
  },
  {
    key: 'kyc',
    label: 'KYC',
    path: '/onboarding/kyc',
  },
  {
    key: 'documents',
    label: 'Documents',
    path: '/onboarding/documents',
  },
  {
    key: 'bank',
    label: 'Bank Details',
    path: '/onboarding/bank-details',
  },
];

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const DASHBOARD_NAV = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    key: 'consultations',
    label: 'Consultations',
    path: '/dashboard/consultations',
    icon: 'MessageCircle',
  },
  {
    key: 'messages',
    label: 'Chat',
    path: '/dashboard/messages',
    icon: 'MessageSquare',
  },
  {
    key: 'live-streaming',
    label: 'Live Streaming',
    path: '/dashboard/live-streaming',
    icon: 'Radio',
  },
  {
    key: 'earnings',
    label: 'Earnings',
    path: '/dashboard/earnings',
    icon: 'TrendingUp',
  },
  {
    key: 'wallet',
    label: 'Withdrawals',
    path: '/dashboard/wallet',
    icon: 'Wallet',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    path: '/dashboard/notifications',
    icon: 'Bell',
  },
  {
    key: 'kyc',
    label: 'KYC',
    path: '/dashboard/kyc',
    icon: 'ShieldCheck',
  },
  {
    key: 'tickets',
    label: 'Tickets',
    path: '/dashboard/tickets',
    icon: 'Ticket',
  },
  {
    key: 'profile',
    label: 'Profile',
    path: '/dashboard/profile',
    icon: 'User',
  },
  {
    key: 'settings',
    label: 'Settings',
    path: '/dashboard/settings',
    icon: 'Settings',
  },
];

export const WEBSITE_NAV = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'How It Works',
    path: '/how-it-works',
  },
  {
    label: 'Benefits',
    path: '/benefits',
  },
  {
    label: 'Earnings',
    path: '/earnings-info',
  },
  {
    label: 'FAQ',
    path: '/faq',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];