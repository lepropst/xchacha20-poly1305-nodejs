import { randomBytes } from "@noble/ciphers/utils.js";

export const generateKey = () => {
  return randomBytes(32);
};

export const generateNonce = () => {
  return randomBytes(24);
};
