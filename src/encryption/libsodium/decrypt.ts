import _sodium from "libsodium-wrappers";
import { UTF8Decode } from "@xchacha-poly-1305/utilities";

export const decrypt = async (
  cipherText: string,
  metadata: Record<string, string> & { nonce: Uint8Array },
  secretKey: Uint8Array
): Promise<string> => {
  try {
    await _sodium.ready;
    const AD = JSON.stringify(metadata);
    const result = _sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
      null,
      cipherText,
      AD,
      metadata.nonce,
      secretKey
    );
    return UTF8Decode(result);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

/**
 sodium: any;
   keyStore: any;
   constructor() {
     this.sodium = undefined;
     this.keyStore = undefined;
 
   }
   async init() {
     await _sodium.ready;
     this.sodium = _sodium;
     this.keyStore = await KeyStore.createKeyStore(process.env.KEYFILE, this.sodium);
   }
 
   isInitialized() {
     if (this.sodium === undefined || this.keyStore === undefined) {
       return false;
     }
     return true;
   }
 
   generateNonce() {
     let nonce = Buffer.alloc(this.sodium.crypto_secretbox_NONCEBYTES);
     if (this.isInitialized() === true) {
       this.sodium.randombytes_buf(nonce);
     }
     return nonce;
   }
   getSecretKey(username, pw) {
 
     if (this.isInitialized() === true) {
       this.keyStore.getPrivateKeyData(username, pw);
     }
   }
  
   decrypt(ciphertext, metadata: { username: string, nonce: string }, password) {
   }
 */
