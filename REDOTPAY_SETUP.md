# CARLODZ + RedotPay Connect

The website now uses a server-side RedotPay Connect integration.

## What is included

- Buy buttons for WayScoot ($5), Burger Shot ($5), WayPets ($10), Cat Coffee ($5).
- Server endpoint `POST /api/create-payment`.
- RedotPay Connect order creation using RSA SHA256 signatures.
- RedotPay webhook endpoint: `POST /api/redotpay/webhook`.
- Local order state in `data/orders.json`.
- Payment status endpoint: `GET /api/payment-status?order=...`.

## Important

Do not put the RedotPay app key or private key inside `app.js`. They belong on the server.

RedotPay requires merchant verification/developer access for the OpenAPI integration. Start with Sandbox, then switch `REDOTPAY_ENV=production` when your merchant account is approved.

## Setup

1. Install Node.js 18+.
2. Copy `.env.example` to `.env`.
3. Fill in your RedotPay `appKey`, key version and RSA private key.
4. Set `PUBLIC_URL` to the public HTTPS URL of your site when deployed.
5. Configure the RedotPay webhook URL as:
   `https://YOUR-DOMAIN/api/redotpay/webhook`
6. Start with:
   `node server.js`
7. Open the site on port 5500.

## Product delivery

The payment system marks an order `PAID` only from the RedotPay payment webhook. To deliver paid files, put the final download URL in the `download` field for the product in `server.js` and add your desired post-payment download UI.

For production, replace `data/orders.json` with a real database and keep private keys in a secret manager.
