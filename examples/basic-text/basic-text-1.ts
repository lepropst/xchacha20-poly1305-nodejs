// import {
//   generateKey,
//   generateNonce,
//   passwordBasedKeyDerivation,
//   encrypt,
//   decrypt,
// } from "../../dist/index.js";
// import type { User } from "../../dist/index";

import {
  generateKey,
  generateNonce,
  passwordBasedKeyDerivation,
  encrypt,
  decrypt,
} from "@lepropst/xchacha20-poly1305";

import type { User } from "@lepropst/xchacha20-poly1305";

// import { randomBytes } from "@noble/ciphers/utils.js";
// const nonce = randomBytes(24);

const plaintext = "Some plaintext in english with a period.";

const exampleUser: User = {
  name: "Fake name",
  key: new Uint8Array(),
  nonces: [],
};

const nonce = generateNonce();

const key = generateKey();
const { key: secondKey } = passwordBasedKeyDerivation(exampleUser, "password");

const cipherTextOne = encrypt(key, nonce, plaintext);
const cipherTextTwo = encrypt(secondKey, nonce, plaintext);

const decodedTextOne = decrypt(key, nonce, cipherTextOne);
const decodedTextTwo = decrypt(secondKey, nonce, cipherTextTwo);

const exampleOneText = `Example ONE\nPlaintext: ${plaintext}\nCipherText: ${cipherTextOne}\nDecodedText: ${decodedTextOne}\n\n\nKey: ${key.toString()}\nNonce: ${nonce}`;
const exampleTwoText = `Example TWO\nPlaintext: ${plaintext}\nCipherText: ${cipherTextTwo}\nDecodedText: ${decodedTextTwo}\n\n\nKey: ${secondKey.toString()}\nNonce: ${nonce}`;

console.log("Example one is the following\n", exampleOneText);
console.log("Example two is the following\n", exampleTwoText);
