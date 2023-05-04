export {};

export enum STATUS_USER {
  PENDING,
  ACTIVE,
}

export enum STATUS_DIARY {
  PUBLIC,
  PRIVATE,
}

export enum STATUS {
  ERROR,
  OK,
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

export interface Diary {
  diaryId?: string;
  status_diary: STATUS_DIARY;
  title: string;
  content: string;
  userId?: string;
}

export interface MyContext {
  payload?: Record<string, any, null>;
  token?: string;
  prisma: any;
}

export interface Message {
  status: STATUS;
  message: string;
}

export interface Payload {
  id: string;
  role: string;
}
