# MarketingKart.ai — React Native App Continuation Prompt

## Yeh prompt dusre Replit account mein paste karo

---

## PROJECT STATUS (Abhi tak kya bana hai)

Yeh React Native CLI project hai **MarketingKart.ai** ke liye — WhatsApp Marketing + Meta Ads platform.

### ✅ Jo ban gaya hai:

**Core:**
- `package.json` — all dependencies listed
- `App.js`, `index.js`, `metro.config.js`, `babel.config.js`, `app.json`
- `src/theme/index.js` — complete design system (colors, fonts, sizes, shadows)
- `src/utils/mockData.js` — all mock data (campaigns, templates, conversations, ads, wallet, plans)
- `src/utils/helpers.js` — utility functions
- `src/services/api.js` — full API service layer
- `src/context/AuthContext.js` — auth state management
- `src/navigation/index.js` — root navigator (Auth + App + BottomTabs)
- `src/navigation/WhatsAppNavigator.js` — WA module stack navigator

**Components:**
- `src/components/common/GradientButton.js`
- `src/components/common/StatusBadge.js`
- `src/components/common/SkeletonCard.js`

**Auth Screens:**
- `src/screens/Auth/LoginScreen.js`
- `src/screens/Auth/RegisterScreen.js`

**Home:**
- `src/screens/Home/HomeScreen.js`

**Profile:**
- `src/screens/Profile/ProfileScreen.js`

**WhatsApp Marketing Module:**
- `src/screens/WhatsApp/WhatsAppShell.js`
- `src/screens/WhatsApp/screens/DashboardScreen.js`
- `src/screens/WhatsApp/screens/CampaignsListScreen.js`
- `src/screens/WhatsApp/screens/CampaignCreateScreen.js`
- `src/screens/WhatsApp/screens/CampaignReportScreen.js`
- `src/screens/WhatsApp/screens/TemplatesScreen.js`
- `src/screens/WhatsApp/screens/TemplateCreateScreen.js`
- `src/screens/WhatsApp/screens/ChatScreen.js`
- `src/screens/WhatsApp/screens/ChatThreadScreen.js`
- `src/screens/WhatsApp/screens/ContactsScreen.js`
- `src/screens/WhatsApp/screens/WalletScreen.js`
- `src/screens/WhatsApp/screens/PricingScreen.js`
- `src/screens/WhatsApp/screens/ProfileScreen.js`
- `src/screens/WhatsApp/screens/HelpSupportScreen.js`
- `src/screens/WhatsApp/screens/NotificationScreen.js`
- `src/screens/WhatsApp/components/ConnectWhatsAppModal.js`
- `src/screens/WhatsApp/components/WhatsAppPreview.js`

**Meta Ads Module:**
- `src/screens/MetaAds/AdsTabScreen.js`
- `src/screens/MetaAds/AdsDetails.js`
- `src/screens/MetaAds/AdsPageFirst.js` (Step 1: Budget/Plan)
- `src/screens/MetaAds/AdsPageSecond.js` (Step 2: Creative/Copy)
- `src/screens/MetaAds/AdsPageThird.js` (Step 3: Targeting/Pay)
- `src/screens/MetaAds/RestartAds.js`
- `src/screens/MetaAds/components/FbLinkModal.js`
- `src/screens/MetaAds/components/NicheAdModal.js`

---

## 🎯 TASK: Fix, verify, and complete the app

### Step 1 — Read the key files first:
Read these files to understand the current state:
- `MarketingKartApp/src/theme/index.js`
- `MarketingKartApp/src/utils/mockData.js`
- `MarketingKartApp/src/navigation/index.js`
- `MarketingKartApp/App.js`

### Step 2 — Fix any import path issues:
Some screens may have wrong import paths. The correct paths from `src/screens/WhatsApp/screens/` to theme are `'../../../theme'`.
The correct paths from `src/screens/MetaAds/` to theme are `'../../theme'`.
Check and fix all screens.

### Step 3 — Consolidate mockData:
There may be duplicate mockData files at:
- `src/utils/mockData.js` (MASTER — use this)
- `src/data/mockData.js` (DELETE)
- `src/screens/MetaAds/mockData.js` (DELETE — update imports)
- `src/screens/WhatsApp/mockData.js` (DELETE — update imports)

All screens should import from `../../utils/mockData` or `../../../utils/mockData`.

### Step 4 — Verify all screens compile (no missing imports):
Run through each file and ensure:
- All Icon names are valid Ionicons names
- All component imports exist
- LinearGradient imported correctly
- No undefined variables

### Step 5 — Write README:
Create `MarketingKartApp/README.md` with setup instructions.

---

## Design System Reference

```
Brand: MarketingKart.ai (NOT LeadKart)
Domain: marketingkart.in
Logo: Orange-red gradient #FF4500→#FF8C00 "MK" mark + dark navy #1A1F3C wordmark

Primary Indigo: #3F51B5
Primary Dark: #213a8a
WA Green (only chat/WA UI): #25D366, #00A884
FB Blue (OAuth only): #1877F2
Page bg: #F5F7FF
Cards: white, radius 16-20, light shadow
Buttons: full-width pill (borderRadius: 100), indigo fill

Ad Status colors:
ACTIVE: #4CAF50
IN_REVIEW: #FFC107
COMPLETED: #2196F3
IN_PROGRESS/PREPARING: #FFA726
PAUSED: #FF5722
DELIVERY_ERROR: #f01334

Campaign Status:
QUEUED: #3b82f6
RUNNING: #8b5cf6
COMPLETED: #22c55e
PAUSED: #f59e0b
FAILED: #ef4444
DRAFT: #71717a
```

## Dependencies to install:
```bash
cd MarketingKartApp
npm install
# For iOS:
cd ios && pod install && cd ..
# For Android: just npm run android
```

## Run:
```bash
# Start metro
npx react-native start
# Android (new terminal)
npx react-native run-android
# iOS
npx react-native run-ios
```

---

## SPEC FILES (for reference when fixing screens):
- `META_ADS_UI_FULL_SPEC.md` — Meta Ads UI complete spec
- `WHATSAPP_MARKETING_UI_FULL_SPEC.md` — WhatsApp Marketing UI complete spec
