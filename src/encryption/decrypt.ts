import { TextUtil } from "@/utilities/text-util";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
export const decrypt = (
  key: Uint8Array,
  nonce: Uint8Array,
  ciphertext: Uint8Array,
  AAD?: Uint8Array
): string => {
  return TextUtil.getInstance().decodeFromUint8Array(
    xchacha20poly1305(key, nonce, AAD).decrypt(ciphertext)
  );
};
