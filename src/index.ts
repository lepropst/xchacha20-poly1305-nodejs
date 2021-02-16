
import * as/** @const */ _sodium from "libsodium-wrappers";
import {KeyStore} from './keyStore';
import * as dotenv from 'dotenv';
dotenv.config();

export default class XChacha20PolyAEEAD {
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
  isInitialized(){
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
  encrypt(message, metadata, password) {
    // get user public key
    try {
      let ciphertext;
      const nonce = this.generateNonce();
      const key = this.getSecretKey(metadata.username, password);
      let AD = JSON.stringify(metadata);

      if (typeof message === 'string' || message instanceof String) {
        ciphertext = Buffer.from(this.sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
          message,
          AD,
          null,
          nonce,
          key
        ));
        return ciphertext;
      } else {
        console.log("unable to parse mesage as string");
        throw new Error("unable to parse message as string" );
      }
    } catch (e) {
      console.error(e);
      return -1;
    }
  }
  decrypt(ciphertext, metadata: {username: string, nonce: string}, password) {
    try {
      const key = this.getSecretKey(metadata.username, password);
      
      let AD = JSON.stringify(metadata);
      const result = this.sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null,
        ciphertext,
        AD,
        metadata.nonce,
        key
      );
      if (result !== 0) {
        throw new Error("unable to decrypt text");
      } else {
        return result;
      }
    } catch (e) {
      return new Error(  "cannot decipher text" );
    }
  }
}

