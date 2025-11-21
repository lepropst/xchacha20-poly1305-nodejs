import { TextDecoder, TextEncoder } from "util";

export class TextUtil {
  private static instance: TextUtil | null = null;
  private decoderInstance: TextDecoder;
  private encoderInstance: TextEncoder;

  constructor() {
    this.decoderInstance = new TextDecoder();
    this.encoderInstance = new TextEncoder();
  }

  public static getInstance(): TextUtil {
    if (!TextUtil.instance) {
      TextUtil.instance = new TextUtil();
    }
    return TextUtil.instance;
  }

  public static resetInstance(): void {
    TextUtil.instance = null;
  }
  public encodeToUint8Array(data: string): Uint8Array {
    return this.encoderInstance.encode(data);
  }

  public decodeFromUint8Array(data: Uint8Array): string {
    return this.decoderInstance.decode(data);
  }
}

const str = "sending something";
console.log(str);
const encoded = TextUtil.getInstance().encodeToUint8Array(str);
console.log(str, encoded, TextUtil.getInstance().decodeFromUint8Array(encoded));
