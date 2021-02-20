import { KeyStore } from "../src/keyStore";

// function Base64Encode(data: Uint8Array): string {
test('testing the keyStore', () => {
  expect(KeyStore.test()).toBe("testing keystore")
})
