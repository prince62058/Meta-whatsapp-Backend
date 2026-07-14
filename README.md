# Meta WhatsApp Backend (LeadKart)

Node.js / Express API for LeadKart — includes Meta Ads, WhatsApp Marketing (Cloud API), wallet, and webhooks.

## Quick start

```bash
npm install
cp env.example .env
# edit .env with your real values

cp src/config/firebase.json.example src/config/firebase.json
# paste Firebase service-account JSON

npm start
```

App entry: `src/server.js` (via `nodemon` / `package.json`).

## Environment

All required keys are documented in **`env.example`**.  
Copy it to `.env` — never commit real secrets.

## Structure

```
src/
  server.js app.js
  config/ controllers/ helpers/ middlewares/
  models/ queues/ routes/ services/
  startup/ utils/ workers/
  Message/
```
