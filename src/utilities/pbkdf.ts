import { pbkdf2 } from "@noble/hashes/pbkdf2.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { User } from "./user.interface";
import { randomBytes } from "@noble/hashes/utils.js";
import { generateKey } from "./generators";

const getSalt = () => {
  return randomBytes(16);
};
const validUser: User = {
  key: generateKey(),
  name: "Some fake Name",
  nonces: [],
};
const checkUserRequirements = (user: User) => {
  for (const keyofUser of Object.keys(user) as (keyof User)[]) {
    if (
      user[keyofUser] === null ||
      typeof user[keyofUser] !== typeof validUser[keyofUser]
    ) {
      throw new Error(
        `Invalid property found in the user when trying to derive a key.\n${keyofUser}\t${user[keyofUser]}`
      );
    }
  }
};
/**
 *
 * @param user user to update and return
 * @param password password to use in deriving key, not stored in user object by default.
 * @returns new user definition that contains the key.
 */
export const passwordBasedKeyDerivation = (
  user: User,
  password: string | Uint8Array
): User => {
  checkUserRequirements(user);
  const defaultConfig = { c: 524288, dkLen: 32 };
  const salt = getSalt();
  const passwordBasedKey = pbkdf2(sha256, password, salt, defaultConfig);
  const updatedUser = { ...user, key: passwordBasedKey };
  return updatedUser;
};
