import { Base64Decode } from "../src/utilities";

// function Base64Encode(data: Uint8Array): string {
test('encodes base64', () => {
  expect(Base64Decode("hello")).expect("aGVsbG8=")
})
