import * as fs from 'fs';
import { promisify } from 'util';
import * as crypto from 'crypto';
import * as _sodium from 'libsodium-wrappers';

import { UTF8Encode,
Base64Decode,
UTF8Decode } from './utilities';

interface KeyStoreInterface{
  keysData: any
  getKeyIDs (): string[]
  getPublicKeyData (keyId: string): any
  getPrivateKeyData (keyId: string, password: Uint8Array): any
  getRawKeyData (keyId: string): RawKeyData
  saveKey (keyId: string, password: Uint8Array, privateData: any, publicData?: any): any
  saveKeys (data: {keyId: string, password: Uint8Array, privateData: any, publicData?: any}[]): Promise<void>
  savePublicKeyData (keyId: string, publicData: any): Promise<void>
  removeKey (keyId: string): Promise<void>
}

interface KeyMetadata {
  nonce: string,
  iterations: number
}


interface RawKeyData {
  metadata: KeyMetadata,
  public: any,
  private: string
}


interface KeysData {
  [keyID: string]: RawKeyData
}


type SaveKeys = (data: KeysData) => Promise<void> | void

class KeyStore implements KeyStoreInterface {
  keysData: any;
  iterations: number;
  save: any;
  sodium: any;

  constructor(save: SaveKeys, initialKeys: KeysData = {},
    options: { iterations?: number} = {}, sodium: any) {
    if(options.iterations) {
      this.iterations = options.iterations;
    } else { this.iterations = 10000 }
    this.keysData = initialKeys;
    this.save = save;
    this.sodium = sodium
    
  }
static test() {
    console.log('testing keystore')
  }
 static async createKeyStore (filePath: string, sodium: any)  {
  const readFile: any = promisify(fs.readFile);
  const writeFile: any = promisify(fs.writeFile);
  const saveKeys = (data: any) => writeFile(filePath, JSON.stringify(data), 'utf8');
  const iterations = 10000;
  const readKeys = async () => JSON.parse(await readFile(filePath, 'utf8'));
  return new KeyStore(saveKeys, await readKeys(), {iterations}, sodium);
 }

  getKeyIDs = (): string[] => {
    return Object.keys(this.keysData);
  }
  getPublicKeyData = (keyId: string): any => {
    return this.keysData[keyId].public;
    }
  
  getPrivateKeyData = (keyId: string, password: Uint8Array): any => {
    try {
      return this.decrypt(this.keysData[keyId].private, this.keysData[keyId].metadata, password);
    } catch(e) {console.error(e); return e;}
  }
  
  
  getRawKeyData = (keyId: string): RawKeyData => {
    return this.keysData[keyId];
  }
  
  
  instanceSaveKey = (keyId: string, password: Uint8Array, privateData: any, publicData?: any | {}): void => {
      const iterations = this.iterations;
      const nonce = this.randomNonce();
      const metadata = {
        nonce,iterations
      }
      this.keysData[keyId] = {
        metadata, public: publicData, private: this.encrypt(privateData, metadata, password)
      }
    }
    async saveKey (keyID: string, password: Uint8Array, privateData: any, publicData: any | {} = {}) {
      this.instanceSaveKey(keyID, password, privateData, publicData)
      await this.save(this.keysData)
    }
  
  
  saveKeys = async (data: { keyId: string; password: Uint8Array; privateData: any; publicData?: any; }[]): Promise<void> => {
    try {
        data.forEach(d => this.saveKey(d.keyId, d.password, d.privateData, d.publicData))
        await this.save(this.keysData);
      } catch(e) {
        console.error(e);
        return e;
      }
  }
  
  
  savePublicKeyData = async (keyId: string, publicData: any): Promise<void> => {
    if (!this.keysData[keyId]) {
            // Prevent creating an incomplete key record
            throw new Error(`Cannot save public data for key ${keyId}. Key does not yet exist in store.`);
        }
        try {
          this.keysData[keyId] = {
            ...this.keysData[keyId],
            public: publicData
          }
          await this.save(this.keysData)
        } catch(e) {
          console.error(e);
          return e;
        }
  }
  
  
  removeKey = async (keyId: string): Promise<void> => {
    if (!this.keysData[keyId]) {
          throw new Error(`Cannot delete key ${keyId}. Key not found.`);
      }
      try {
        delete this.keysData[keyId]
        await this.save(this.keysData)
      } catch(e) {
        console.error(e);
        return e;
      }
        
  }

randomNonce()  {
    if(this.sodium){
      var sodium = this.sodium;
      return sodium.to_base64(sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES));
    }
  }

deriveHashFromPassword(password: Uint8Array, metadata: { nonce: string; iterations: number; }) {
    let tmp = crypto.pbkdf2Sync(
      UTF8Decode(password),
      Base64Decode(metadata.nonce),
      metadata.iterations,
      this.sodium.crypto_secretbox_KEYBYTES,
      'sha256',
    );
    return tmp;
  }
decrypt(ciphertext: string, metadata: { nonce: any; iterations: number; }, password: Uint8Array) {
    const secretKey = this.deriveHashFromPassword(password, metadata);
    const decrypted = this.sodium.crypto_secretbox_open_easy(
      Base64Decode(ciphertext),
      Base64Decode(metadata.nonce),
      secretKey
    );
    if (!decrypted) {
      throw new Error("decryption failed.");
    }
    return JSON.parse(UTF8Decode(decrypted));
  }

encrypt(plaintext: any, metadata: { nonce: any; iterations: number; }, password: Uint8Array) {
    const secretKey = this.deriveHashFromPassword(password, metadata);
    const data = UTF8Encode(JSON.stringify(plaintext));
    const encrypted = this.sodium.crypto_secretbox_easy(
      data,
      Base64Decode(metadata.nonce),
      secretKey
    );
    if (encrypted !== 0) {
      throw new Error("message forged");
    }
    return encrypted;
  }
}

export {
RawKeyData,
KeysData,
SaveKeys,
KeyStore,
KeyStoreInterface
};