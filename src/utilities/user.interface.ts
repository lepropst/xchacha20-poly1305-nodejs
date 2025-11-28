export interface User {
  name: string;
  key: Uint8Array;
  nonces: ArrayLike<Nonce>;
}

export interface Nonce {
  id: number;
  value: string;
  createdAt: Date;
  user: User;
}
