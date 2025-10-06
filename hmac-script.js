import crypto from "crypto";

const HMAC_SECRET = "all-pass-111-reset-vbtc-game/123456";

const body = {
  username: "john",
  email: "rao977684@gmail.com",
  new_password: "StrongPassw0rd!"
};

const rawBody = JSON.stringify(body);

const signature = crypto
  .createHmac("sha256", HMAC_SECRET)
  .update(rawBody)
  .digest("base64");

console.log("rawBody:", rawBody);
console.log("x-signature:", signature);
