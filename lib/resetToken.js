// lib/resetToken.js
import jwt from "jsonwebtoken";

const SECRET = process.env.RESET_PASSWORD_SECRET;

export function createResetJWT(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "5m" });
}

export function verifyResetJWT(token) {
  return jwt.verify(token, SECRET);
}
