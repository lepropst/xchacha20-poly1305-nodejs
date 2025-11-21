import { randomBytes } from "@noble/ciphers/utils.js";
import { testingString } from "./constants";
import { TextUtil } from "../text-util";
import { expect, it, test } from "vitest";
import { generateNonce, generateKey } from "../generators";
test("Key and nonce generator testing for length", async () => {
  expect((await generateKey()).byteLength).toEqual(32);
  expect((await generateNonce()).byteLength).toEqual(24);
});
