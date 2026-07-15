// ============================================================
// MarketingKart.ai — Master Mock Data (single source of truth)
// ============================================================

export const MOCK_USER = {
  id: '1',
  name: 'Rahul Sharma',
  businessName: 'Rahul Digital Agency',
  email: 'rahul@example.com',
  phone: '9876543210',
};

// ── WhatsApp Account ──────────────────────────────────────
export const MOCK_WA_ACCOUNT = {
  connected: true,
  phoneNumber: '+91 98765 43210',
  businessName: 'Rahul Digital Agency',
  status: 'CONNECTED',
};

export const MOCK_WA_STATS = {
  totalContacts: 1245,
  messagesSent: 8932,
  deliveryRate: 94.2,
};

// ── Campaigns ─────────────────────────────────────────────
export const MOCK_CAMPAIGNS = [
  {
    _id: '1', id: '1',
    name: 'Diwali Festival Offer',
    status: 'COMPLETED',
    template: 'diwali_offer_2024',
    totalContacts: 500, sent: 498, delivered: 471, read: 312, failed: 2,
    createdAt: '2024-10-28T10:00:00Z',
  },
  {
    _id: '2', id: '2',
    name: 'New Year Sale Blast',
    status: 'RUNNING',
    template: 'new_year_sale',
    totalContacts: 800, sent: 620, delivered: 589, read: 210, failed: 0,
    createdAt: '2024-12-30T09:00:00Z',
  },
  {
    _id: '3', id: '3',
    name: 'Summer Offer 2025',
    status: 'PAUSED',
    template: 'summer_offer',
    totalContacts: 400, sent: 200, delivered: 185, read: 90, failed: 5,
    createdAt: '2025-01-02T11:00:00Z',
  },
  {
    _id: '4', id: '4',
    name: 'Product Launch',
    status: 'DRAFT',
    template: null,
    totalContacts: 0, sent: 0, delivered: 0, read: 0, failed: 0,
    createdAt: '2025-01-05T14:00:00Z',
  },
];

// ── Templates ─────────────────────────────────────────────
export const MOCK_TEMPLATES = [
  {
    _id: '1', id: '1',
    name: 'welcome_message',
    category: 'MARKETING',
    language: 'en_US',
    status: 'APPROVED',
    bodyText: 'Hi {{1}}! Welcome to {{2}}. We are thrilled to have you onboard. Explore our latest offers and deals today! 🎉',
    headerType: 'TEXT',
    headerText: 'Welcome to MarketingKart.ai',
    footerText: 'Reply STOP to unsubscribe',
    buttons: [{type: 'URL', text: 'Visit Website', url: 'https://marketingkart.in'}],
  },
  {
    _id: '2', id: '2',
    name: 'festival_offer',
    category: 'MARKETING',
    language: 'en_US',
    status: 'APPROVED',
    bodyText: '🎊 Special festival offer for {{1}}! Get {{2}}% OFF on all products. Valid till {{3}}. Hurry, limited time!',
    headerType: 'IMAGE',
    headerText: null,
    footerText: 'T&C apply',
    buttons: [{type: 'QUICK_REPLY', text: 'Claim Offer'}, {type: 'QUICK_REPLY', text: 'Know More'}],
  },
  {
    _id: '3', id: '3',
    name: 'order_confirmation',
    category: 'UTILITY',
    language: 'en_US',
    status: 'PENDING',
    bodyText: 'Your order #{{1}} has been confirmed! Expected delivery: {{2}}. Track your order here.',
    headerType: 'NONE',
    headerText: null,
    footerText: null,
    buttons: [{type: 'URL', text: 'Track Order', url: 'https://marketingkart.in/track'}],
  },
  {
    _id: '4', id: '4',
    name: 'abandoned_cart',
    category: 'MARKETING',
    language: 'en_US',
    status: 'REJECTED',
    bodyText: 'Hi {{1}}, you left something in your cart! Complete your purchase now and get 10% off with code {{2}}.',
    headerType: 'TEXT',
    headerText: 'Complete Your Purchase',
    footerText: null,
    buttons: [{type: 'URL', text: 'Go to Cart', url: 'https://marketingkart.in/cart'}],
  },
];

export const LANGUAGES = [
  {label: 'English (US)', value: 'en_US'},
  {label: 'Hindi (India)', value: 'hi_IN'},
  {label: 'Gujarati', value: 'gu_IN'},
  {label: 'Marathi', value: 'mr_IN'},
  {label: 'Tamil', value: 'ta_IN'},
  {label: 'Telugu', value: 'te_IN'},
  {label: 'Bengali', value: 'bn_IN'},
];

export const VARIABLE_FIELD_OPTIONS = ['Name', 'Phone', 'Email', 'City', 'Order ID', 'Custom'];

// ── Conversations & Messages ──────────────────────────────
export const MOCK_CONVERSATIONS = [
  {id: '1', _id: '1', customerName: 'Priya Sharma', customerPhone: '+91 98765 43210', lastMessage: 'Thank you! I received the order.', lastMessageTime: '10:42 AM', unreadCount: 2, avatarColor: '#7C3AED', status: 'active'},
  {id: '2', _id: '2', customerName: 'Rahul Mehta', customerPhone: '+91 91234 56789', lastMessage: 'Can you send me the invoice?', lastMessageTime: '9:15 AM', unreadCount: 0, avatarColor: '#0EA5E9', status: 'active'},
  {id: '3', _id: '3', customerName: 'Anjali Verma', customerPhone: '+91 99887 76655', lastMessage: 'Is the product still available?', lastMessageTime: 'Yesterday', unreadCount: 5, avatarColor: '#F59E0B', status: 'active'},
  {id: '4', _id: '4', customerName: 'Sanjay Patel', customerPhone: '+91 93456 12345', lastMessage: 'Please share the catalog.', lastMessageTime: 'Yesterday', unreadCount: 0, avatarColor: '#10B981', status: 'active'},
  {id: '5', _id: '5', customerName: 'Deepika Singh', customerPhone: '+91 88123 45678', lastMessage: 'When will the offer end?', lastMessageTime: 'Mon', unreadCount: 1, avatarColor: '#EF4444', status: 'active'},
  {id: '6', _id: '6', customerName: 'Meera Joshi', customerPhone: '+91 85567 89012', lastMessage: 'I want to place a bulk order.', lastMessageTime: 'Sun', unreadCount: 3, avatarColor: '#6366F1', status: 'active'},
];

export const MOCK_MESSAGES = [
  {id: '1', type: 'inbound', text: 'Hi, I saw your ad for the summer sale. Do you have any discounts?', time: '10:01 AM', status: 'read'},
  {id: '2', type: 'outbound', text: 'Hello! Yes, we have 30% off on all products until Sunday. Want our catalog?', time: '10:03 AM', status: 'read'},
  {id: '3', type: 'inbound', text: 'That sounds great! Please send the catalog.', time: '10:05 AM', status: 'read'},
  {id: '4', type: 'outbound', text: "Sure! Here's our catalog: https://marketingkart.in/catalog 🎉", time: '10:07 AM', status: 'delivered'},
  {id: '5', type: 'inbound', text: 'Do you offer free delivery?', time: '10:30 AM', status: 'read'},
  {id: '6', type: 'outbound', text: 'Yes! Free delivery on orders above ₹999 🚀', time: '10:32 AM', status: 'sent'},
  {id: '7', type: 'inbound', text: 'Thank you! I received the order.', time: '10:42 AM', status: 'read'},
];

// ── Contacts ──────────────────────────────────────────────
export const MOCK_CONTACTS = [
  {id: '1', name: 'Priya Sharma', phone: '+91 98765 43210', email: 'priya@email.com', note: 'Interested in bulk orders.', status: 'active', tags: ['VIP', 'Bulk']},
  {id: '2', name: 'Rahul Mehta', phone: '+91 91234 56789', email: 'rahul@email.com', note: 'Requested invoice for March.', status: 'active', tags: ['Regular']},
  {id: '3', name: 'Anjali Verma', phone: '+91 99887 76655', email: 'anjali@email.com', note: 'Prefers evening contact.', status: 'active', tags: ['New']},
  {id: '4', name: 'Sanjay Patel', phone: '+91 93456 12345', email: 'sanjay@email.com', note: '', status: 'active', tags: []},
  {id: '5', name: 'Deepika Singh', phone: '+91 88123 45678', email: 'deepika@email.com', note: 'Asked about seasonal offers.', status: 'active', tags: ['Lead']},
];

// ── Wallet & Plans ────────────────────────────────────────
export const MOCK_WALLET = {
  balance: 2450.00,
  transactions: [
    {_id: '1', type: 'CREDIT', amount: 1000, description: 'Wallet recharge via Razorpay', date: '2025-01-10T10:00:00Z'},
    {_id: '2', type: 'DEBIT', amount: 250, description: 'Campaign: Diwali Festival Offer', date: '2025-01-09T14:30:00Z'},
    {_id: '3', type: 'CREDIT', amount: 2000, description: 'Wallet recharge via Razorpay', date: '2025-01-05T09:15:00Z'},
    {_id: '4', type: 'DEBIT', amount: 300, description: 'Campaign: New Year Sale', date: '2025-01-04T16:00:00Z'},
  ],
};

export const MOCK_PLANS = [
  {_id: '1', name: 'Starter', price: 999, contacts: 500, campaigns: 5, templates: 10, duration: 30, badge: null, color: '#3B82F6'},
  {_id: '2', name: 'Growth', price: 2499, contacts: 2000, campaigns: 20, templates: 50, duration: 30, badge: 'BEST VALUE', color: '#3F51B5'},
  {_id: '3', name: 'Pro', price: 4999, contacts: -1, campaigns: -1, templates: -1, duration: 30, badge: 'POPULAR', color: '#8B5CF6'},
];

// ── Support Tickets ───────────────────────────────────────
export const MOCK_TICKETS = [
  {id: 't1', subject: 'Campaign not sending', category: 'TECHNICAL', priority: 'HIGH', status: 'OPEN', date: '10 Jan 2025', message: 'My campaign shows running but no messages are being sent.'},
  {id: 't2', subject: 'Template approval delay', category: 'GENERAL', priority: 'MEDIUM', status: 'OPEN', date: '5 Jan 2025', message: 'My template has been in PENDING state for 5 days.'},
];

// ── Notifications ─────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  {id: 'n1', title: 'Campaign Completed 🎉', message: 'Your campaign "Diwali Festival Offer" was delivered to 471/500 contacts.', time: '2025-01-10T08:30:00Z', type: 'success', read: false},
  {id: 'n2', title: 'Low Wallet Balance ⚠️', message: 'Your wallet balance is below ₹500. Recharge now to keep campaigns running.', time: '2025-01-09T14:15:00Z', type: 'warning', read: false},
  {id: 'n3', title: 'Template Approved ✅', message: 'Your template "Festival Offer" has been approved. Use it in campaigns now.', time: '2025-01-08T09:00:00Z', type: 'success', read: true},
  {id: 'n4', title: 'New Message 💬', message: 'Priya Sharma replied to your campaign. Open inbox to respond.', time: '2025-01-07T17:45:00Z', type: 'info', read: true},
];

// ── Profile ───────────────────────────────────────────────
export const MOCK_PROFILE = {
  name: 'Rahul Sharma',
  businessName: 'Rahul Digital Agency',
  phone: '+91 98765 43210',
  email: 'rahul@marketingkart.in',
  waStatus: 'CONNECTED',
  totalCampaigns: 12,
  totalTemplates: 8,
  totalContacts: 1245,
};

// ── Meta Ads ──────────────────────────────────────────────
export const MOCK_ADS = [
  {
    _id: '1', id: '1',
    campaignName: 'Real Estate Lead Gen',
    status: 'ACTIVE', adType: 'Lead Ads',
    totalBudget: 5000, impressions: 12400, reach: 9800,
    leads: 87, clicks: 320, totalSpendBudget: 3200,
    thumbnail: null, startDate: '2025-01-01', endDate: '2025-01-20',
    platforms: ['Facebook', 'Instagram'], targetAreas: ['Mumbai', 'Pune'],
    fbBudget: 2500, igBudget: 2500,
  },
  {
    _id: '2', id: '2',
    campaignName: 'Hotel Booking Campaign',
    status: 'IN_REVIEW', adType: 'WhatsApp Ads',
    totalBudget: 3000, impressions: 0, reach: 0,
    leads: 0, clicks: 0, totalSpendBudget: 0,
    thumbnail: null, startDate: '2025-01-12', endDate: '2025-01-25',
    platforms: ['Facebook'], targetAreas: ['Delhi', 'Gurgaon'],
    fbBudget: 3000, igBudget: 0,
  },
  {
    _id: '3', id: '3',
    campaignName: 'Fashion Sale — Summer',
    status: 'COMPLETED', adType: 'Traffic',
    totalBudget: 2000, impressions: 45000, reach: 32000,
    leads: 0, clicks: 1200, totalSpendBudget: 2000,
    thumbnail: null, startDate: '2024-12-15', endDate: '2024-12-30',
    platforms: ['Instagram'], targetAreas: ['Bangalore'],
    fbBudget: 0, igBudget: 2000,
  },
];

export const AD_TYPE_FILTERS = [
  'All', 'Lead Ads', 'WhatsApp Ads', 'Traffic', 'Awareness', 'Sales', 'App Install', 'Call Ads',
];

export const MOCK_AD_PLANS = [
  {id: 'starter', _id: 'starter', name: 'Starter', price: 2999, duration: '7 Days', color: ['#3F51B5', '#5C6BC0'], estimatedReach: '10,000 – 25,000', estimatedLeads: '50 – 120', kpi: '50–120 Leads', features: ['1 Ad Creative', 'Basic Targeting', 'Email Support', 'Performance Report']},
  {id: 'growth', _id: 'growth', name: 'Growth', price: 5999, duration: '15 Days', color: ['#7B1FA2', '#AB47BC'], estimatedReach: '40,000 – 80,000', estimatedLeads: '200 – 450', kpi: '200–450 Leads', features: ['3 Ad Creatives', 'Advanced Targeting', 'Priority Support', 'Weekly Report', 'A/B Testing']},
  {id: 'pro', _id: 'pro', name: 'Pro', price: 9999, duration: '30 Days', color: ['#1565C0', '#1E88E5'], estimatedReach: '1,00,000 – 2,50,000', estimatedLeads: '500 – 1200', kpi: '500–1200 Leads', features: ['5 Ad Creatives', 'Premium Targeting', '24/7 Support', 'Daily Reports', 'A/B Testing', 'Remarketing']},
  {id: 'enterprise', _id: 'enterprise', name: 'Enterprise', price: 19999, duration: '30 Days', color: ['#BF360C', '#E64A19'], estimatedReach: '3,00,000 – 7,00,000', estimatedLeads: '1500 – 4000', kpi: '1500–4000 Leads', features: ['Unlimited Creatives', 'Custom Targeting', 'Dedicated Manager', 'Real-time Dashboard', 'Full Funnel Strategy']},
];

export const MOCK_INTERESTS = [
  {id: 'real_estate', label: 'Real Estate'},
  {id: 'home_decor', label: 'Home Decor'},
  {id: 'fitness', label: 'Fitness & Wellness'},
  {id: 'fashion', label: 'Fashion'},
  {id: 'food', label: 'Food & Dining'},
  {id: 'travel', label: 'Travel'},
  {id: 'education', label: 'Education'},
  {id: 'technology', label: 'Technology'},
  {id: 'beauty', label: 'Beauty & Skincare'},
  {id: 'automobile', label: 'Automobile'},
  {id: 'finance', label: 'Finance & Investment'},
  {id: 'healthcare', label: 'Healthcare'},
  {id: 'sports', label: 'Sports'},
  {id: 'gaming', label: 'Gaming'},
  {id: 'entrepreneurship', label: 'Entrepreneurship'},
  {id: 'ecommerce', label: 'E-Commerce'},
  {id: 'yoga', label: 'Yoga & Meditation'},
  {id: 'cooking', label: 'Cooking'},
];

export const MOCK_LOCATIONS = [
  {id: 'mumbai', label: 'Mumbai', state: 'Maharashtra'},
  {id: 'delhi', label: 'Delhi', state: 'Delhi'},
  {id: 'bangalore', label: 'Bengaluru', state: 'Karnataka'},
  {id: 'hyderabad', label: 'Hyderabad', state: 'Telangana'},
  {id: 'chennai', label: 'Chennai', state: 'Tamil Nadu'},
  {id: 'kolkata', label: 'Kolkata', state: 'West Bengal'},
  {id: 'pune', label: 'Pune', state: 'Maharashtra'},
  {id: 'ahmedabad', label: 'Ahmedabad', state: 'Gujarat'},
  {id: 'jaipur', label: 'Jaipur', state: 'Rajasthan'},
  {id: 'surat', label: 'Surat', state: 'Gujarat'},
  {id: 'lucknow', label: 'Lucknow', state: 'Uttar Pradesh'},
  {id: 'nagpur', label: 'Nagpur', state: 'Maharashtra'},
  {id: 'indore', label: 'Indore', state: 'Madhya Pradesh'},
  {id: 'gurgaon', label: 'Gurugram', state: 'Haryana'},
  {id: 'noida', label: 'Noida', state: 'Uttar Pradesh'},
  {id: 'kochi', label: 'Kochi', state: 'Kerala'},
  {id: 'chandigarh', label: 'Chandigarh', state: 'Punjab'},
  {id: 'goa', label: 'Goa', state: 'Goa'},
];

export const MOCK_NICHES = [
  {id: 'real_estate', label: 'Real Estate', icon: 'home', color: ['#1565C0', '#1E88E5']},
  {id: 'hotel', label: 'Hotel & Travel', icon: 'bed', color: ['#00695C', '#00897B']},
  {id: 'fashion', label: 'Fashion', icon: 'shirt', color: ['#AD1457', '#E91E63']},
  {id: 'food', label: 'Food & Dining', icon: 'restaurant', color: ['#E65100', '#FF5722']},
  {id: 'fitness', label: 'Fitness', icon: 'barbell', color: ['#2E7D32', '#43A047']},
  {id: 'education', label: 'Education', icon: 'school', color: ['#4527A0', '#7B1FA2']},
  {id: 'healthcare', label: 'Healthcare', icon: 'medical', color: ['#00838F', '#00ACC1']},
  {id: 'automobile', label: 'Automobile', icon: 'car', color: ['#37474F', '#546E7A']},
  {id: 'beauty', label: 'Beauty', icon: 'color-palette', color: ['#C2185B', '#E91E63']},
  {id: 'finance', label: 'Finance', icon: 'trending-up', color: ['#1B5E20', '#388E3C']},
  {id: 'ecommerce', label: 'E-Commerce', icon: 'cart', color: ['#E65100', '#F57C00']},
  {id: 'technology', label: 'Technology', icon: 'hardware-chip', color: ['#0D47A1', '#1976D2']},
];

export const MOCK_FB_PAGES = [
  {id: 'p1', name: 'Rahul Digital Agency', category: 'Marketing Agency', followers: 1240, pageId: '100000001'},
  {id: 'p2', name: 'My Business Page', category: 'Local Business', followers: 560, pageId: '100000002'},
  {id: 'p3', name: 'Shop & Deals', category: 'Shopping & Retail', followers: 3200, pageId: '100000003'},
];
