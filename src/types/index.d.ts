export {};

export interface User {
  username: string;
  email: string;
  password: string;
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
