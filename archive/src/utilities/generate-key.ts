import _sodium from "libsodium-wrappers";

export const generateLibSodiumNonce = async () => {
  return _sodium.randombytes_buf(
    _sodium.crypto_aead_xchacha20poly1305_IETF_NPUBBYTES
  );
};
