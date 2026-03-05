# @avora/sdk

> **Version:** v1.0.1 | **Updated:** 2026-03-05 | **Author:** ArcH (Bot_Avora)

**Official SDK for Avora OS L1 Financial Kernel**

Communicate with the Avora financial engine using the AVTP (Avora Value Transfer Protocol).

## Features

- HMAC-SHA256 request signing
- Nonce anti-replay protection
- Auto-incrementing sequence
- Retry-safe execution
- Canonical envelope builder

## Installation

```bash
npm install @avora/sdk
```

## Usage

```js
const AVTPClient = require("@avora/sdk");

const client = new AVTPClient({
  baseURL: "http://localhost:3000",
  tenantId: "YOUR_TENANT_UUID",
  secret: "YOUR_HMAC_SECRET"
});

// Health check
await client.health();

// Record revenue
await client.revenue(100000, "USD");

// Mint to wallet
await client.mint(walletId, 50000, "HKD");

// Check balance
await client.balance(walletId);
```

## Protocol

All requests are sent to:

```
POST /protocol/execute
```

### Envelope Format

```json
{
  "tenant_id": "uuid",
  "nonce": "uuid",
  "sequence": 1,
  "method": "mint",
  "params": { ... }
}
```

### Signature

```
HMAC-SHA256(secret, JSON.stringify(canonicalized_envelope))
```

Sent via header:
```
X-AVTP-SIGNATURE: <hex_digest>
```

### Canonicalization

Keys are sorted alphabetically before signing. This ensures deterministic signatures regardless of object key order.

## Supported Methods

| Method | Description |
|--------|-------------|
| `mint` | Credit a wallet |
| `apply_revenue` | Record revenue event |
| `balance_of` | Query wallet balance |

## Multi-Currency

The SDK supports any currency. Currency codes follow ISO 4217 (USD, CAD, HKD, EUR, etc.). Each entity/property can have its own currency — the kernel resolves it automatically.

## Error Handling

The SDK retries failed requests up to 3 times by default. Non-OK responses throw an error with the server's message.

```js
try {
  await client.mint(walletId, 1000, "USD");
} catch (err) {
  console.error(err.message); // "Insufficient balance" etc.
}
```

## Compatibility

| SDK Version | Kernel Version |
|-------------|----------------|
| v1.0.x | L1-v7.x, L1-v8.x |

## Related

- [avora-os](https://github.com/boris9668-web/avora-os) — Main platform (L1 + L2 + L3)
- @avora/sdk-pms — Hotel PMS plugin SDK (planned)

## License

MIT
