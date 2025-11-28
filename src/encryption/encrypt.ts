import { TextUtil } from "@utilities/text-util";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";

export const encrypt = (
  key: Uint8Array,
  nonce: Uint8Array,
  data: Uint8Array | string,
  AAD?: Uint8Array
): Uint8Array => {
  let validatedData: Uint8Array =
    typeof data === "string"
      ? TextUtil.getInstance().encodeToUint8Array(data)
      : data;

  return xchacha20poly1305(key, nonce, AAD).encrypt(validatedData);
};
