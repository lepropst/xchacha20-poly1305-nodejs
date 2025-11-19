export class BaseAdapter {
  /**
   * @param {Nonce} nonce - The nonce key to add.
   * @returns {Promise<boolean>} Resolves to true if the nonce was added (it was new), false if it already existed (collision).
   */
  async add(nonce: Uint8Array): Promise<boolean> {
    throw new Error("Method 'add()' must be implemented.");
  }

  /**
   * @param {Nonce} nonce - The nonce key to check.
   * @returns {Promise<boolean>} Resolves to true if the nonce exists.
   */
  async has(nonce: Uint8Array): Promise<boolean> {
    throw new Error("Method 'has()' must be implemented.");
  }

  /**
   * @param {Nonce} nonce - The nonce key to remove.
   * @returns {Promise<boolean>} Resolves to true if the nonce was removed, false if it didn't exist.
   */
  async delete(nonce: Uint8Array): Promise<boolean> {
    throw new Error("Method 'delete()' must be implemented.");
  }
}
