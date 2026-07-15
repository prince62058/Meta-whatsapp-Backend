// ============================================================
// MarketingKart.ai — Utility Helpers
// ============================================================
import {AD_STATUS_COLORS, CAMPAIGN_STATUS_COLORS} from '../theme';

export const getAdStatusColor = status => AD_STATUS_COLORS[status] || '#94A3B8';
export const getCampaignStatusColor = status => CAMPAIGN_STATUS_COLORS[status] || '#94A3B8';

export const formatNumber = n => {
  if (!n && n !== 0) return '—';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

export const formatCurrency = (amount, symbol = '₹') => {
  if (!amount && amount !== 0) return '—';
  return `${symbol}${formatNumber(amount)}`;
};

export const formatDate = dateStr => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'});
};

export const formatDateShort = dateStr => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {day: '2-digit', month: 'short'});
};

export const getStatusMessage = status => {
  switch (status) {
    case 'ACTIVE': return 'Your ad is live and performing well.';
    case 'IN_REVIEW': return 'Your ad is being reviewed by Meta. This may take up to 24 hours.';
    case 'COMPLETED': return 'This campaign has ended. Restart to continue reaching your audience.';
    case 'IN_PROGRESS': return 'Your ad is being set up and will go live soon.';
    case 'PREPARING': return 'We are preparing your ad. It will go live shortly.';
    case 'PAUSED': return 'Your ad is paused. Resume it to continue delivery.';
    case 'DELIVERY_ERROR': return 'There was an issue delivering your ad. Please contact support.';
    default: return 'Status unavailable.';
  }
};
