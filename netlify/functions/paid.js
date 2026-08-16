const { getStore } = require("@netlify/blobs");

// Shared admin password. Change this string, then redeploy, to change the password.
const ADMIN_KEY = "kachori2026";

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  const store = getStore("kachoris-payments");

  if (event.httpMethod === "GET") {
    const data = (await store.get("paid", { type: "json" })) || {};
    const key = event.headers["x-admin-key"];
    const body = key !== undefined ? { ...data, __verified: key === ADMIN_KEY } : data;
    return { statusCode: 200, headers: CORS, body: JSON.stringify(body) };
  }

  if (event.httpMethod === "POST") {
    if (!event.headers["x-admin-key"] || event.headers["x-admin-key"] !== ADMIN_KEY) {
      return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: "Unauthorized" }) };
    }
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Bad JSON" }) };
    }
    if (!body.name) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Missing name" }) };
    }
    const current = (await store.get("paid", { type: "json" })) || {};
    current[body.name] = Math.max(0, Number(body.paidUsd) || 0);
    await store.set("paid", JSON.stringify(current));
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, data: current }) };
  }

  return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "Method not allowed" }) };
};
