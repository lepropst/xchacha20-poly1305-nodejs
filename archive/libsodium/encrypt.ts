import _sodium from "libsodium-wrappers";
import { TextEncoder } from "util";
// import { generateNonce } from "@xchacha-poly-1305/utilities";

export const encrypt = async (
  message: string,
  metadata: Record<string, string>,
  password: string,
  secretKey: Uint8Array
): Promise<Uint8Array | false> => {
  try {
    const nonce = new TextEncoder().encode("cannonFodderString"); //await generateNonce();
    const AD = JSON.stringify(metadata);

    const ciphertext = Buffer.from(
      _sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        message,
        AD,
        null,
        nonce,
        secretKey
      )
    );
    return ciphertext;
  } catch (e) {
    console.error(e);
    return false;
  }
};
