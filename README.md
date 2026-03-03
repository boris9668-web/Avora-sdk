# Avora SDK (AVTP Protocol v1.0)

Official client SDK for Avora Financial Kernel (L1).

## Features

- HMAC-SHA256 signing
- Nonce anti-replay
- Sequence auto-increment
- Retry-safe execution
- Canonical envelope builder

---

## Installation

npm install avora-sdk

---

## Usage

```js
const AVTPClient = require("avora-sdk");

const client = new AVTPClient({
  baseURL: "http://localhost:3000",
  tenantId: "YOUR_TENANT_ID",
  secret: "YOUR_SECRET"
});

// Mint
await client.mint(walletId, 1000, "USD");

// Revenue
await client.revenue(1000, "USD");

// Balance
await client.balance(walletId);


⸻

Protocol

All requests are sent to:

POST /protocol/execute

Envelope format:

{
  tenant_id,
  nonce,
  sequence,
  method,
  params
}

Signed with:

HMAC-SHA256(secret, JSON.stringify(envelope))

Header:

X-AVTP-SIGNATURE


⸻

Version

v1.0.0 (compatible with L1 v7.0.0-avtp-core-financial-stable)

⸻

License
