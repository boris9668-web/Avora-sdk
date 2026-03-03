const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const CryptoJS = require("crypto-js");

class AVTPClient {
  constructor({ baseURL, tenantId, secret }) {
    this.baseURL = baseURL;
    this.tenantId = tenantId;
    this.secret = secret;
    this.sequence = 0;
  }

  canonicalize(obj) {
    return JSON.stringify(
      Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
          acc[key] = obj[key];
          return acc;
        }, {})
    );
  }

  sign(payload) {
    const canonical = this.canonicalize(payload);
    return CryptoJS.HmacSHA256(
      canonical,
      this.secret
    ).toString();
  }

  async execute(method, params, retry = 3) {
    this.sequence += 1;

    const envelope = {
      tenant_id: this.tenantId,
      nonce: uuidv4(),
      sequence: this.sequence,
      method,
      params
    };

    const signature = this.sign(envelope);

    try {
      const res = await axios.post(
        `${this.baseURL}/protocol/execute`,
        envelope,
        {
          headers: {
            "X-AVTP-SIGNATURE": signature
          }
        }
      );

      if (res.data.status !== "OK") {
        throw new Error(res.data.message || "Protocol Error");
      }

      return res.data;

    } catch (err) {
      if (retry > 0) {
        return this.execute(method, params, retry - 1);
      }
      throw err;
    }
  }

  async mint(walletId, amount, currency) {
    return this.execute("mint", {
      to_wallet: walletId,
      amount,
      currency
    });
  }

  async revenue(amount, currency) {
    return this.execute("apply_revenue", {
      amount,
      currency
    });
  }

  async balance(walletId) {
    return this.execute("balance_of", {
      wallet_id: walletId
    });
  }

  async health() {
    const res = await axios.get(`${this.baseURL}/health`);
    return res.data;
  }
}

module.exports = AVTPClient;
