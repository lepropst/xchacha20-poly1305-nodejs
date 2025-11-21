import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { TextEncoder } from "util";

export const encrypt = (
  key: Uint8Array,
  nonce: Uint8Array,
  data: Uint8Array | string
) => {
  if (typeof data === "string") {
    return xchacha20poly1305(key, nonce).encrypt(
      new TextEncoder().encode(data)
    );
  }
  return xchacha20poly1305(key, nonce).encrypt(data);
};
