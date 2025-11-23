import { randomBytes } from "@noble/ciphers/utils.js";
import { encrypt, decrypt } from "../index";
import { testingString } from "./constants";
import { TextEncoder } from "util";
import { expect, test } from "vitest";
import { generateNonce, generateKey, TextUtil } from "../../utilities/index";

const encryptionTest = test.extend({
  testingKey: await generateKey(),
  testingNonce: await generateNonce(),
});

encryptionTest(
  "Testing encryption changes the string to not equal original",
  async ({ testingKey, testingNonce }) => {
    const encrypted = encrypt(testingKey, testingNonce, testingString);
    expect(encrypted).not.toEqual(testingString);
  }
);

encryptionTest(
  "Testing encryption can be decrypted by given function into original string.",
  async ({ testingKey, testingNonce }) => {
    const encodedTextAsUint8Array = encrypt(
      testingKey,
      testingNonce,
      new TextEncoder().encode(testingString)
    );
    const encodedTextAsString = encrypt(
      testingKey,
      testingNonce,
      testingString
    );
    expect(encodedTextAsUint8Array).toEqual(encodedTextAsString);

    const encryptedText = encrypt(testingKey, testingNonce, testingString);
    const decryptedText = decrypt(testingKey, testingNonce, encryptedText);
    expect(decryptedText).toEqual(testingString);
  }
);

encryptionTest(
  "Should reject tampered ciphertext",
  async ({ testingKey, testingNonce }) => {
    const ciphertext = encrypt(testingKey, testingNonce, testingString);
    const originalCiphertextCopy = Uint8Array.from(ciphertext);
    ciphertext[0] ^= 1;
    expect(() => decrypt(testingKey, testingNonce, ciphertext)).toThrow();
    expect(() =>
      decrypt(testingKey, testingNonce, originalCiphertextCopy)
    ).not.toThrow();
  }
);

encryptionTest("should authenticate AAD", ({ testingKey, testingNonce }) => {
  const plaintext = testingString;
  const encodedPlaintext = new TextEncoder().encode(plaintext);

  const aad = new TextEncoder().encode(
    JSON.stringify({
      user: "someFakeUser",
      extraInfo: { location: "Milky Way", occupation: "diety" },
    })
  );

  const ciphertext = encrypt(testingKey, testingNonce, encodedPlaintext, aad);
  const decrypted = decrypt(testingKey, testingNonce, ciphertext, aad);

  expect(decrypted).toEqual(plaintext);
});

encryptionTest(
  "should reject with wrong AAD",
  ({ testingKey, testingNonce }) => {
    const plaintext = new TextEncoder().encode("Message");
    const aad1 = new TextEncoder().encode("metadata1");
    const aad2 = new TextEncoder().encode("metadata2");

    const ciphertext = encrypt(testingKey, testingNonce, plaintext, aad1);

    expect(() => decrypt(testingKey, testingNonce, ciphertext, aad2)).toThrow();
  }
);

encryptionTest("should reject invalid key length", async ({ testingNonce }) => {
  const plaintext = new Uint8Array(10);
  const invalidKey = new Uint8Array(16); // Wrong size

  expect(() => encrypt(invalidKey, testingNonce, plaintext)).toThrow();
});

encryptionTest("should reject invalid nonce length", ({ testingKey }) => {
  const plaintext = new Uint8Array(10);
  const invalidNonce = new Uint8Array(12); // Wrong size

  expect(() => encrypt(testingKey, invalidNonce, plaintext)).toThrow();
});

encryptionTest(
  "Should handle large messages (256MB)",
  ({ testingKey, testingNonce }) => {
    const size = 256 * 1024 * 1024;
    const plaintext = new Uint8Array(size).fill(1);
    const ciphertext = encrypt(testingKey, testingNonce, plaintext);
    const decrypted = decrypt(testingKey, testingNonce, ciphertext);
    expect(decrypted).toEqual(
      TextUtil.getInstance().decodeFromUint8Array(plaintext)
    );
  },
  10 * 10 * 100 // 10 second timeout option
);
