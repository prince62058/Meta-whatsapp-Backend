// ============================================================
// MarketingKart.ai — Design System / Theme
// ============================================================

export const COLORS = {
  // Brand
  primary: '#3F51B5',
  primaryDark: '#213a8a',
  primaryLight: '#7986CB',
  primaryAlt: '#2563eb',

  // MarketingKart brand gradient (logo colors)
  brandOrange: '#FF4500',
  brandOrangeLight: '#FF8C00',

  // Page backgrounds
  pageBg: '#F5F7FF',
  pageBgSlate: '#F8FAFC',
  white: '#FFFFFF',
  black: '#000000',

  // Text hierarchy
  textTitle: '#0F172A',
  textBody: '#18181b',
  textSecondary: '#334669',
  textMuted: '#64748B',
  textInactive: '#94A3B8',

  // WhatsApp realism
  waGreen: '#25D366',
  waGreenDark: '#128C7E',
  waGreenSend: '#00A884',
  waHeader: '#075E54',
  waBubbleOut: '#DCF8C6',
  waWallpaper: '#efe7dd',
  waBlueTick: '#34B7F1',

  // Meta / Facebook
  metaBlue: '#1877F2',
  metaBlueDark: '#1565D8',
  metaBlueLight: '#E8F0FE',

  // Neutrals
  gray20: '#CCCCCC',
  gray40: '#999999',
  gray60: '#666666',
  gray80: '#333333',
  gray90: '#191919',
  lightGray: '#C1C1C1',
  softBand: '#F4F4F4',

  // Semantic — Meta Ads status
  adActive: '#4CAF50',
  adInReview: '#FFC107',
  adCompleted: '#2196F3',
  adInProgress: '#FFA726',
  adPaused: '#FF5722',
  adError: '#f01334',
  adSchedule: '#4CAF50',

  // Semantic — WhatsApp campaign status
  waQueued: '#3b82f6',
  waRunning: '#8b5cf6',
  waDone: '#22c55e',
  waPaused: '#f59e0b',
  waFailed: '#ef4444',
  waDraft: '#71717a',

  // Semantic — general
  success: '#22c55e',
  successDark: '#16a34a',
  successBg: '#ECFDF5',
  warning: '#F59E0B',
  warningDark: '#D97706',
  warningBg: '#FFFBEB',
  error: '#ef4444',
  errorBg: '#FEE2E2',
  info: '#3b82f6',

  // Quick Action gradients
  qaContacts: ['#3B82F6', '#2563EB'],
  qaCampaigns: ['#8B5CF6', '#6D28D9'],
  qaInbox: ['#F59E0B', '#D97706'],
  qaReports: ['#10B981', '#059669'],
  qaTemplates: ['#EC4899', '#DB2777'],

  // Payment
  razorpay: '#F37254',
};

export const FONTS = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};

export const SIZES = {
  // Border radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 20,
  radius2xl: 24,
  radiusFull: 100,

  // Spacing
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Typography
  caption: 11,
  small: 12,
  body: 14,
  bodyLg: 15,
  subtitle: 16,
  title: 18,
  titleLg: 20,
  h2: 22,
  h1: 28,
  hero: 32,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Ad status color map
export const AD_STATUS_COLORS = {
  ACTIVE: COLORS.adActive,
  IN_REVIEW: COLORS.adInReview,
  COMPLETED: COLORS.adCompleted,
  IN_PROGRESS: COLORS.adInProgress,
  PREPARING: COLORS.adInProgress,
  PAUSED: COLORS.adPaused,
  SCHEDULE: COLORS.adSchedule,
  DELIVERY_ERROR: COLORS.adError,
};

// Campaign status color map
export const CAMPAIGN_STATUS_COLORS = {
  QUEUED: COLORS.waQueued,
  RUNNING: COLORS.waRunning,
  COMPLETED: COLORS.waDone,
  PAUSED: COLORS.waPaused,
  FAILED: COLORS.waFailed,
  DRAFT: COLORS.waDraft,
};

// Template status colors
export const TEMPLATE_STATUS_COLORS = {
  APPROVED: COLORS.success,
  PENDING: COLORS.warning,
  REJECTED: COLORS.error,
};
