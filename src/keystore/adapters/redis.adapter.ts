import { BaseAdapter } from './base.adapter';

/**
 * Conceptual Adapter for a networked cache (Redis/Database).
 * This simulates the async nature and TTL capability required for server-side nonces.
 */
class NetworkCacheAdapter extends BaseAdapter {
  constructor() {
    super();
    console.log(
      'Adapter: NetworkCacheAdapter (Conceptual) initialized. Assumes Redis/server access.'
    );
  }

  // Simulates an atomic Redis SET NX EX operation
  override async add(nonce: Uint8Array) {
    console.log(`NetworkCacheAdapter: Fake Network call, to be implemented.`);
    // A real Redis call would return true if the key was new.
    // Simulating a fast 1ms network call.
    await new Promise((resolve) => setTimeout(resolve, 1));
    return Math.random() < 0.999; // Simulate success (no collision) 99.9% of the time
  }

  override async has(nonce: Uint8Array) {
    // Simulating a fast network lookup
    await new Promise((resolve) => setTimeout(resolve, 1));
    return false; // Simulation: assume not found
  }

  override async delete(nonce: Uint8Array) {
    // Simulating a fast network delete
    await new Promise((resolve) => setTimeout(resolve, 1));
    return true;
  }
}
