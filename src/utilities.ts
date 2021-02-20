/**
 * Package base64 implements Base64 encoding and decoding.
 */


const INVALID_UTF16 = "utf8: invalid string";
const INVALID_UTF8 = "utf8: invalid source encoding";


// Invalid character used in decoding to indicate
// that the character to decode is out of range of
// alphabet and cannot be decoded.
const INVALID_BYTE = 256;

/**
 * Implements standard Base64 encoding.
 *
 * Operates in constant time.
 */
class Coder {
  // TODO(dchest): methods to encode chunk-by-chunk.
  private _paddingCharacter: string;
  constructor(_paddingCharacter = "=") {
    this._paddingCharacter = _paddingCharacter
  }


  public encode(data: Uint8Array): string {
    let out = "";

    let i = 0;
    for (; i < data.length - 2; i += 3) {
      let c = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
      out += this._encodeByte((c >>> (3 * 6)) & 63);
      out += this._encodeByte((c >>> (2 * 6)) & 63);
      out += this._encodeByte((c >>> (1 * 6)) & 63);
      out += this._encodeByte((c >>> (0 * 6)) & 63);
    }

    const left = data.length - i;
    if (left > 0) {
      let c = (data[i] << 16) | (left === 2 ? data[i + 1] << 8 : 0);
      out += this._encodeByte((c >>> (3 * 6)) & 63);
      out += this._encodeByte((c >>> (2 * 6)) & 63);
      if (left === 2) {
        out += this._encodeByte((c >>> (1 * 6)) & 63);
      } else {
        out += this._paddingCharacter || "";
      }
      out += this._paddingCharacter || "";
    }

    return out;
  }

  public decode(s: string): Uint8Array {
    if (s.length === 0) {
      return new Uint8Array(0);
    }
    const paddingLength = this._getPaddingLength(s);
    const length = s.length - paddingLength;
    const out = new Uint8Array(this.maxDecodedLength(length));
    let op = 0;
    let i = 0;
    let haveBad = 0;
    let v0 = 0,
      v1 = 0,
      v2 = 0,
      v3 = 0;
    for (; i < length - 4; i += 4) {
      v0 = this._decodeChar(s.charCodeAt(i + 0));
      v1 = this._decodeChar(s.charCodeAt(i + 1));
      v2 = this._decodeChar(s.charCodeAt(i + 2));
      v3 = this._decodeChar(s.charCodeAt(i + 3));
      out[op++] = (v0 << 2) | (v1 >>> 4);
      out[op++] = (v1 << 4) | (v2 >>> 2);
      out[op++] = (v2 << 6) | v3;
      haveBad |= v0 & INVALID_BYTE;
      haveBad |= v1 & INVALID_BYTE;
      haveBad |= v2 & INVALID_BYTE;
      haveBad |= v3 & INVALID_BYTE;
    }
    if (i < length - 1) {
      v0 = this._decodeChar(s.charCodeAt(i));
      v1 = this._decodeChar(s.charCodeAt(i + 1));
      out[op++] = (v0 << 2) | (v1 >>> 4);
      haveBad |= v0 & INVALID_BYTE;
      haveBad |= v1 & INVALID_BYTE;
    }
    if (i < length - 2) {
      v2 = this._decodeChar(s.charCodeAt(i + 2));
      out[op++] = (v1 << 4) | (v2 >>> 2);
      haveBad |= v2 & INVALID_BYTE;
    }
    if (i < length - 3) {
      v3 = this._decodeChar(s.charCodeAt(i + 3));
      out[op++] = (v2 << 6) | v3;
      haveBad |= v3 & INVALID_BYTE;
    }
    if (haveBad !== 0) {
      throw new Error("Base64Coder: incorrect characters for decoding");
    }
    return out;
  }
  private maxDecodedLength(length: number): number {
    if (!this._paddingCharacter) {
      return ((length * 6 + 7) / 8) | 0;
    }
    return ((length / 4) * 3) | 0;
  }


  // Standard encoding have the following encoded/decoded ranges,
  // which we need to convert between.
  //
  // ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789  +   /
  // Index:   0 - 25                    26 - 51              52 - 61   62  63
  // ASCII:  65 - 90                    97 - 122             48 - 57   43  47
  //

  // Encode 6 bits in b into a new character.
  protected _encodeByte(b: number): string {
    // Encoding uses constant time operations as follows:
    //
    // 1. Define comparison of A with B using (A - B) >>> 8:
    //          if A > B, then result is positive integer
    //          if A <= B, then result is 0
    //
    // 2. Define selection of C or 0 using bitwise AND: X & C:
    //          if X == 0, then result is 0
    //          if X != 0, then result is C
    //
    // 3. Start with the smallest comparison (b >= 0), which is always
    //    true, so set the result to the starting ASCII value (65).
    //
    // 4. Continue comparing b to higher ASCII values, and selecting
    //    zero if comparison isn't true, otherwise selecting a value
    //    to add to result, which:
    //
    //          a) undoes the previous addition
    //          b) provides new value to add
    //
    let result = b;
    // b >= 0
    result += 65;
    // b > 25
    result += ((25 - b) >>> 8) & (0 - 65 - 26 + 97);
    // b > 51
    result += ((51 - b) >>> 8) & (26 - 97 - 52 + 48);
    // b > 61
    result += ((61 - b) >>> 8) & (52 - 48 - 62 + 43);
    // b > 62
    result += ((62 - b) >>> 8) & (62 - 43 - 63 + 47);

    return String.fromCharCode(result);
  }

  // Decode a character code into a byte.
  // Must return 256 if character is out of alphabet range.
  protected _decodeChar(c: number): number {
    // Decoding works similar to encoding: using the same comparison
    // function, but now it works on ranges: result is always incremented
    // by value, but this value becomes zero if the range is not
    // satisfied.
    //
    // Decoding starts with invalid value, 256, which is then
    // subtracted when the range is satisfied. If none of the ranges
    // apply, the function returns 256, which is then checked by
    // the caller to throw error.
    let result = INVALID_BYTE; // start with invalid character

    // c == 43 (c > 42 and c < 44)
    result += (((42 - c) & (c - 44)) >>> 8) & (-INVALID_BYTE + c - 43 + 62);
    // c == 47 (c > 46 and c < 48)
    result += (((46 - c) & (c - 48)) >>> 8) & (-INVALID_BYTE + c - 47 + 63);
    // c > 47 and c < 58
    result += (((47 - c) & (c - 58)) >>> 8) & (-INVALID_BYTE + c - 48 + 52);
    // c > 64 and c < 91
    result += (((64 - c) & (c - 91)) >>> 8) & (-INVALID_BYTE + c - 65 + 0);
    // c > 96 and c < 123
    result += (((96 - c) & (c - 123)) >>> 8) & (-INVALID_BYTE + c - 97 + 26);

    return result;
  }

  private _getPaddingLength(s: string): number {
    let paddingLength = 0;
    if (this._paddingCharacter) {
      for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] !== this._paddingCharacter) {
          break;
        }
        paddingLength++;
      }
      if (s.length < 4 || paddingLength > 2) {
        throw new Error("Base64Coder: incorrect padding");
      }
    }
    return paddingLength;
  }
}
/**
 * Encodes the given string into UTF-8 byte array.
 * Throws if the source string has invalid UTF-16 encoding.
 */

 function encodedLength(s: string): number {
  let result = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x80) {
      result += 1;
    } else if (c < 0x800) {
      result += 2;
    } else if (c < 0xd800) {
      result += 3;
    } else if (c <= 0xdfff) {
      if (i >= s.length - 1) {
        throw new Error(INVALID_UTF16);
      }
      i++; // "eat" next character
      result += 4;
    } else {
      throw new Error(INVALID_UTF16);
    }
  }
  return result;
}

function UTF8Encode(s: string): Uint8Array {
  // Calculate result length and allocate output array.
  // encodedLength() also validates string and throws errors,
  // so we don't need repeat validation here.
  const arr = new Uint8Array(encodedLength(s));

  let pos = 0;
  for (let i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i);
    if (c < 0x80) {
      arr[pos++] = c;
    } else if (c < 0x800) {
      arr[pos++] = 0xc0 | (c >> 6);
      arr[pos++] = 0x80 | (c & 0x3f);
    } else if (c < 0xd800) {
      arr[pos++] = 0xe0 | (c >> 12);
      arr[pos++] = 0x80 | ((c >> 6) & 0x3f);
      arr[pos++] = 0x80 | (c & 0x3f);
    } else {
      i++; // get one more character
      c = (c & 0x3ff) << 10;
      c |= s.charCodeAt(i) & 0x3ff;
      c += 0x10000;

      arr[pos++] = 0xf0 | (c >> 18);
      arr[pos++] = 0x80 | ((c >> 12) & 0x3f);
      arr[pos++] = 0x80 | ((c >> 6) & 0x3f);
      arr[pos++] = 0x80 | (c & 0x3f);
    }
  }
  return arr;
}

/**
 * Returns the number of bytes required to encode the given string into UTF-8.
 * Throws if the source string has invalid UTF-16 encoding.
 */
function UTF8EncodedLength(s: string): number {
  let result = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x80) {
      result += 1;
    } else if (c < 0x800) {
      result += 2;
    } else if (c < 0xd800) {
      result += 3;
    } else if (c <= 0xdfff) {
      if (i >= s.length - 1) {
        throw new Error(INVALID_UTF16);
      }
      i++; // "eat" next character
      result += 4;
    } else {
      throw new Error(INVALID_UTF16);
    }
  }
  return result;
}

/**
 * Decodes the given byte array from UTF-8 into a string.
 * Throws if encoding is invalid.
 */
function UTF8Decode(arr: Uint8Array): string {
  const chars: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    let b = arr[i];

    if (b & 0x80) {
      let min;
      if (b < 0xe0) {
        // Need 1 more byte.
        if (i >= arr.length) {
          throw new Error(INVALID_UTF8);
        }
        const n1 = arr[++i];
        if ((n1 & 0xc0) !== 0x80) {
          throw new Error(INVALID_UTF8);
        }
        b = ((b & 0x1f) << 6) | (n1 & 0x3f);
        min = 0x80;
      } else if (b < 0xf0) {
        // Need 2 more bytes.
        if (i >= arr.length - 1) {
          throw new Error(INVALID_UTF8);
        }
        const n1 = arr[++i];
        const n2 = arr[++i];
        if ((n1 & 0xc0) !== 0x80 || (n2 & 0xc0) !== 0x80) {
          throw new Error(INVALID_UTF8);
        }
        b = ((b & 0x0f) << 12) | ((n1 & 0x3f) << 6) | (n2 & 0x3f);
        min = 0x800;
      } else if (b < 0xf8) {
        // Need 3 more bytes.
        if (i >= arr.length - 2) {
          throw new Error(INVALID_UTF8);
        }
        const n1 = arr[++i];
        const n2 = arr[++i];
        const n3 = arr[++i];
        if (
          (n1 & 0xc0) !== 0x80 ||
          (n2 & 0xc0) !== 0x80 ||
          (n3 & 0xc0) !== 0x80
        ) {
          throw new Error(INVALID_UTF8);
        }
        b =
          ((b & 0x0f) << 18) |
          ((n1 & 0x3f) << 12) |
          ((n2 & 0x3f) << 6) |
          (n3 & 0x3f);
        min = 0x10000;
      } else {
        throw new Error(INVALID_UTF8);
      }

      if (b < min || (b >= 0xd800 && b <= 0xdfff)) {
        throw new Error(INVALID_UTF8);
      }

      if (b >= 0x10000) {
        // Surrogate pair.
        if (b > 0x10ffff) {
          throw new Error(INVALID_UTF8);
        }
        b -= 0x10000;
        chars.push(String.fromCharCode(0xd800 | (b >> 10)));
        b = 0xdc00 | (b & 0x3ff);
      }
    }

    chars.push(String.fromCharCode(b));
  }
  return chars.join("");
}


const stdCoder = new Coder();



/**
 * 
 * Base 64 
 */
function Base64Encode(data: Uint8Array): string {
  return stdCoder.encode(data);
}

function Base64Decode(s: string): Uint8Array {
  return stdCoder.decode(s);
}

export {
  UTF8Encode,
UTF8EncodedLength,
UTF8Decode,
Base64Encode,
Base64Decode,
Coder
};
