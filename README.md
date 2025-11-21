# XChaCha20-Poly1305 AEAD

A TypeScript library providing XChaCha20-Poly1305 authenticated encryption with automatic key and nonce management for Node.js and browser environments.

## Features

- ✅ **XChaCha20-Poly1305 AEAD encryption** - Industry-standard authenticated encryption
- 🔐 **Automatic key generation** - Secure 256-bit key creation
- 🎲 **Nonce collision prevention** - Built-in tracking to prevent nonce reuse
- 🌐 **Universal compatibility** - Works in Node.js and browsers
- 📦 **Zero configuration** - Sensible defaults, simple API
- 🔒 **Type-safe** - Full TypeScript support
- ⚡ **Lightweight** - Minimal dependencies

## Installation

```bash
npm install @lepropst/xchacha20-poly1305
```

## Quick Start

```typescript
import { encrypt, decrypt, generateKey } from "@lepropst/xchacha20-poly1305";

// Generate a key once and store it securely
const key = generateKey();

// Generate a nonce once and store it securely
const nonce = generateKey();

// Encrypt a message
const ciphertext = encrypt(key, nonce, "Hello, World!");

// Decrypt the message
const plaintext = decrypt(key, nonce, ciphertext);
console.log(plaintext); // "Hello, World!"
```

### Error Handling

This project serves as a part of a whole and will throw any native library errors occuring when using `@noble/ciphers` to encrypt with the XChaCha20 Poly1305 AEAD.

### Nonce Management

**It is recommended that you use the associated and tagged KeyStore repository/project in association with this encryption wrapper to ensure secure storage of keys and nonces.**

Each nonce can be reused as long as it is generated randomly for each key. Key Rotation can occur as desired.

[@lepropst/keystore contains the appropriate library to manage keys/nonces](https://github.com/lepropst/keystore)

## License

MIT

## Acknowledgments

Built on [@noble/ciphers](https://github.com/paulmillr/noble-ciphers) - audited, secure cryptographic implementations.

---

**Security Notice**: This library is part of a systems architure project. Appropriate use including rotation of keys, assurance of random nonces, and secure storage are dependent upon the user. This library purely provides the tools necessary to use the AEAD given the appropriate input.
