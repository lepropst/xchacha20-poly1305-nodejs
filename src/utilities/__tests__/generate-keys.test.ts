import { randomBytes } from "@noble/ciphers/utils.js";
import { testingString } from "./constants";
import { TextUtil } from "../text-util";
import { expect, it, test } from "vitest";
import { generateNonce, generateKey } from "../generators";
test("Key and nonce generator testing for length", async () => {
  expect((await generateKey()).byteLength).toEqual(32);
  expect((await generateNonce()).byteLength).toEqual(24);
});
test("Key comparison test", async () => {
  const key1 = await generateKey();
  const key2 = await generateKey();
  expect(key1).not.toEqual(key2);
});

test("Key comparison test", async () => {
  const nonce1 = await generateNonce();
  const nonce2 = await generateNonce();
  expect(nonce1).not.toEqual(nonce2);
});
