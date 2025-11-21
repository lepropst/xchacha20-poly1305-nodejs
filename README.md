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
npm install @yourorg/xchacha20-poly1305
```

## Quick Start

```typescript
import { encrypt, decrypt, generateKey } from "@yourorg/xchacha20-poly1305";

// Generate a key once and store it securely
const key = generateKey();

// Encrypt a message
const ciphertext = encrypt("Hello, World!", key);

// Decrypt the message
const plaintext = decrypt(ciphertext, key);
console.log(plaintext); // "Hello, World!"
```

## API Reference

### `generateKey(): Uint8Array`

Generates a cryptographically secure 256-bit (32-byte) key for XChaCha20-Poly1305.

```typescript
const key = generateKey();
// Store this key securely! Never hardcode it.
```

⚠️ **Important**: Store keys securely using environment variables, key management services, or secure vaults. Never commit keys to version control.

### `generateNonce(): Uint8Array`

Generates a cryptographically secure 192-bit (24-byte) nonce. The library automatically tracks nonces to prevent reuse.

```typescript
const nonce = generateNonce();
// You typically don't need to call this directly
```

### `encrypt(plaintext: string, key: Uint8Array, nonce?: Uint8Array): Uint8Array`

Encrypts a plaintext string using XChaCha20-Poly1305 AEAD.

**Parameters:**

- `plaintext`: The message to encrypt
- `key`: 256-bit encryption key from `generateKey()`
- `nonce` (optional): Custom 192-bit nonce. If omitted, automatically generated and tracked for collision prevention.

**Returns:** Ciphertext as `Uint8Array` (includes authentication tag)

```typescript
const ciphertext = encrypt("Secret message", key);

// With custom nonce (advanced usage)
const customNonce = generateNonce();
const ciphertext = encrypt("Secret message", key, customNonce);
```

### `decrypt(ciphertext: Uint8Array, key: Uint8Array, nonce?: Uint8Array): string`

Decrypts ciphertext and verifies authenticity using XChaCha20-Poly1305 AEAD.

**Parameters:**

- `ciphertext`: Encrypted data from `encrypt()`
- `key`: Same 256-bit key used for encryption
- `nonce` (optional): Nonce used during encryption (if custom nonce was provided)

**Returns:** Decrypted plaintext as string

**Throws:** Error if authentication fails (data tampered with or wrong key)

```typescript
try {
  const plaintext = decrypt(ciphertext, key);
  console.log(plaintext);
} catch (error) {
  console.error("Decryption failed: invalid key or tampered data");
}
```

## Usage Examples

### Basic Encryption/Decryption

```typescript
import { encrypt, decrypt, generateKey } from "@yourorg/xchacha20-poly1305";

const key = generateKey();
const message = "Sensitive data";

const encrypted = encrypt(message, key);
const decrypted = decrypt(encrypted, key);

console.log(decrypted === message); // true
```

### Handling Multiple Messages

```typescript
const key = generateKey();

// Each encryption automatically uses a unique nonce
const msg1 = encrypt("First message", key);
const msg2 = encrypt("Second message", key);
const msg3 = encrypt("Third message", key);

// Nonces are tracked to prevent collisions
console.log(decrypt(msg1, key)); // "First message"
console.log(decrypt(msg2, key)); // "Second message"
console.log(decrypt(msg3, key)); // "Third message"
```

### Storing Keys Securely

```typescript
// ❌ NEVER do this
const key = new Uint8Array([1, 2, 3, ...]); // Hardcoded key

// ✅ Use environment variables
import { Buffer } from 'buffer';

const keyHex = process.env.ENCRYPTION_KEY;
if (!keyHex) throw new Error('Missing ENCRYPTION_KEY');

const key = Buffer.from(keyHex, 'hex');
```

### Error Handling

```typescript
import { encrypt, decrypt, generateKey } from "@yourorg/xchacha20-poly1305";

const key = generateKey();
const wrongKey = generateKey();

const ciphertext = encrypt("Secret", key);

try {
  // This will fail - wrong key
  decrypt(ciphertext, wrongKey);
} catch (error) {
  console.error("Authentication failed:", error.message);
}

try {
  // This will fail - tampered data
  ciphertext[0] ^= 1; // Flip a bit
  decrypt(ciphertext, key);
} catch (error) {
  console.error("Data integrity check failed:", error.message);
}
```

## How It Works

**XChaCha20-Poly1305** is an AEAD (Authenticated Encryption with Associated Data) cipher that provides:

1. **Confidentiality**: XChaCha20 stream cipher encrypts your data
2. **Authenticity**: Poly1305 MAC ensures data hasn't been tampered with
3. **Extended nonce**: 192-bit nonce (vs ChaCha20's 96-bit) virtually eliminates collision risk

**Key Properties:**

- **Key size**: 256 bits (32 bytes)
- **Nonce size**: 192 bits (24 bytes)
- **Authentication tag**: 128 bits (16 bytes)

## Size Limitations

This library uses `TextEncoder`/`TextDecoder` for string conversion, which loads entire messages into memory.

**Recommended limits:**

- ✅ **< 1MB**: Optimal performance
- ⚠️ **1-10MB**: Works, but consider streaming for production
- ❌ **> 10MB**: Not recommended, use streaming encryption

For large files, consider chunked encryption or streaming solutions.

## Security Considerations

### ✅ DO

- Generate keys using `generateKey()`
- Store keys in secure vaults or environment variables
- Use unique keys for different contexts/users
- Rotate keys periodically
- Let the library manage nonces automatically

### ❌ DON'T

- Hardcode keys in source code
- Reuse the same key-nonce pair
- Commit keys to version control
- Share keys over insecure channels
- Modify ciphertext (authentication will fail)

### Nonce Management

The library automatically tracks nonces to prevent reuse with the same key. **Nonce reuse is catastrophic** for stream ciphers - it can leak plaintext.

If you need custom nonce management:

```typescript
const nonce = generateNonce();
const ciphertext = encrypt(plaintext, key, nonce);
// You must store and provide this nonce for decryption
const decrypted = decrypt(ciphertext, key, nonce);
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build library
npm run build

# Check coverage
npm run test:coverage
```

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 90+
- ✅ Safari 15+
- ✅ Node.js 16+

## License

MIT

## Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests.

## Acknowledgments

Built on [@noble/ciphers](https://github.com/paulmillr/noble-ciphers) - audited, secure cryptographic implementations.

---

**⚠️ Security Notice**: This library provides cryptographic primitives. Proper key management and secure deployment practices are your responsibility. For production systems, consider a security audit.
