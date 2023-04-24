export {};

export enum STATUS {
  PENDING,
  ACTIVE,
}

export interface User {
  username: string;
  email: string;
  password: string;
}

export interface Token {
  tokenId: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface Auth {
  usernameOrEmail: string;
  password: string;
}

export interface MyContext {
  payload?: Record<string, any, null>;
  token?: string;
  prisma: any;
}

export interface Payload {
  id: string;
  role: string;
}
