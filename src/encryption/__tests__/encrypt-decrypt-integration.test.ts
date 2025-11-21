import { randomBytes } from "@noble/ciphers/utils.js";
import { encrypt, decrypt } from "../index";
import { testingString } from "./constants";
import { TextEncoder } from "util";
import { expect, it, test } from "vitest";

test("Encryption/Decryption integration", () => {
  const testingKey = randomBytes(32);

  const testingNonce = randomBytes(24);

  expect(encrypt(testingKey, testingNonce, testingString)).not.toEqual(
    testingString
  );

  const encodedTextAsUint8Array = encrypt(
    testingKey,
    testingNonce,
    new TextEncoder().encode(testingString)
  );
  const encodedTextAsString = encrypt(testingKey, testingNonce, testingString);
  expect(encodedTextAsUint8Array).toEqual(encodedTextAsString);

  const encodedText = encrypt(testingKey, testingNonce, testingString);
  expect(decrypt(testingKey, testingNonce, encodedText)).toEqual(testingString);
});
