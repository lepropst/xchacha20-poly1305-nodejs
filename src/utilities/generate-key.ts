import { randomBytes } from "@noble/ciphers/utils.js";
import _sodium from "libsodium-wrappers";

export const generateKey = () => {
  return randomBytes(32);
};
export const generateLibSodiumNonce = async () => {
  return _sodium.randombytes_buf(
    _sodium.crypto_aead_xchacha20poly1305_IETF_NPUBBYTES
  );
};

export const generateNonce = async () => {
  return randomBytes(24);
};
