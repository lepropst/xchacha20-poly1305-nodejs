import { BaseAdapter } from './base.adapter';

/**
 * Adapter for storing nonces in local process memory (JS Set).
 * Ideal for Node.js server processes or browser singletons where nonces are short-lived.
 */
export class InMemoryAdapter extends BaseAdapter {
  /** @type {Set<Nonce>} */
  private nonceSet = new Set();

  constructor() {
    super();
    console.log('Adapter: InMemoryAdapter initialized.');
  }

  override async add(nonce: Uint8Array) {
    if (this.nonceSet.has(nonce)) {
      return false; // Collision
    }
    this.nonceSet.add(nonce);
    return true;
  }

  override async has(nonce: Uint8Array) {
    return this.nonceSet.has(nonce);
  }

  override async delete(nonce: Uint8Array) {
    return this.nonceSet.delete(nonce);
  }
}
