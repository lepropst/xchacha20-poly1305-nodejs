import { testingString } from "./constants";
import { TextUtil } from "../text-util";
import { expect, test } from "vitest";

test("Encode and decode a string for encryption purposes.", () => {
  const encoded = TextUtil.getInstance().encodeToUint8Array(testingString);
  const decoded = TextUtil.getInstance().decodeFromUint8Array(encoded);
  expect(encoded).not.toEqual(testingString);
  expect(decoded).toEqual(testingString);
});
