import { Nonce, User } from "../user.interface";
import { passwordBasedKeyDerivation } from "../pbkdf";

import { expect, test } from "vitest";

const mockKey: Uint8Array = new Uint8Array();

const mockUser: User = { key: mockKey, name: "Fake Name", nonces: [] };
const mockUserFaked: User = {
  key: mockKey,
  name: null as unknown as string,
  nonces: [],
};
const mockUserPartialFaked: User = {
  key: false as unknown as Uint8Array,
  name: null as unknown as string,
  nonces: new Uint32Array(4).fill(0) as unknown as Nonce[],
};

const mockPassword = "someFakePasswordFooFaa";

test("Function returns a user with a key.", async () => {
  const updatedUser = passwordBasedKeyDerivation(mockUser, mockPassword);
  expect(updatedUser.key).not.toEqual(mockKey);
  expect(updatedUser.key.length).toEqual(32);
});

test("Function throws when a user is not complete (has a name).", async () => {
  expect(() =>
    passwordBasedKeyDerivation(mockUserFaked, mockPassword)
  ).toThrow();
});

test("d", async () => {
  expect(() =>
    passwordBasedKeyDerivation(mockUserPartialFaked, mockPassword)
  ).toThrow();
});
