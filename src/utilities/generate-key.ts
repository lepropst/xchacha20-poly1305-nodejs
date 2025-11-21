import { randomBytes } from "@noble/ciphers/utils.js";

export const generateKey = () => {
  return randomBytes(32);
};

export const generateNonce = async () => {
  return randomBytes(24);
};
