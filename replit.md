# MarketingKart.ai — Full Stack Project

## Project Overview

**MarketingKart.ai** (`marketingkart.in`) is a marketing automation platform with three surfaces:

1. **Backend API** (this repo) — Node.js/Express, MongoDB, Redis, BullMQ
2. **Mobile App** (to be built) — React Native CLI, WhatsApp Marketing + Meta Ads modules
3. **Admin Panel** (to be built) — React JS, ops management for WhatsApp & Ads

## Brand

- **Name:** MarketingKart.ai
- **Domain:** marketingkart.in
- **Logo:** `attached_assets/WhatsApp_Image_2026-07-13_at_13.52.55_1784057667107.jpeg`
  - "MK" lettermark with orange-red gradient (left-pointing play + right angle)
  - Wordmark: "MarketingKart" dark navy + ".ai" in red/orange
- **Brand colors:** Orange-red gradient (`#FF4500` → `#FF8C00`) for logo; dark navy `#1A1F3C` for wordmark text

## Architecture

- `src/server.js` — Express app entry point (port 9898)
- `src/app.js` — App configuration
- `src/controllers/` — Route controllers
- `src/models/` — Mongoose models
- `src/routes/` — Express routers
- `src/services/` — Business logic
- `src/workers/` — BullMQ background workers
- `src/queues/` — Job queues (Redis/BullMQ)

## UI Specs

- `WHATSAPP_MARKETING_UI_FULL_SPEC.md` — Complete WhatsApp Marketing module spec
- `META_ADS_UI_FULL_SPEC.md` — Complete Meta Ads module spec

## Design System

**Brand name in UI:** MarketingKart.ai (not LeadKart)  
**Primary:** Indigo `#3F51B5`  
**Brand accent:** Orange-red gradient `#FF4500 → #FF8C00` (logo / brand moments)  
**WhatsApp green:** `#25D366` / `#00A884` (only for WA-specific UI)  
**Facebook blue:** `#1877F2`  
**Fonts:** Poppins (regular, medium, semiBold, bold)

## Environment

All required env keys documented in `env.example`. Copy to `.env` and fill real values:
- MongoDB URI
- Redis host/port/password
- Firebase service account JSON → `src/config/firebase.json`
- Meta/Facebook App credentials
- OpenAI API key
- Razorpay keys
- Object Storage (Linode/DigitalOcean Spaces)

## Running the Backend

```bash
npm install
cp env.example .env
# fill .env with real credentials
cp src/config/firebase.json.example src/config/firebase.json
# paste Firebase service-account JSON
npm start   # nodemon on port 9898
```

## User Preferences

- Mobile app: **React Native CLI** (not Expo)
- Admin panel: **React JS**
- Both WhatsApp Marketing and Meta Ads modules to be built simultaneously
- Beautiful, attractive UI following the design specs
