import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
export const decrypt = (
  key: Uint8Array,
  nonce: Uint8Array,
  ciphertext: Uint8Array
) => {
  return xchacha20poly1305(key, nonce).decrypt(ciphertext);
};
