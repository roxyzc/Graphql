export {};

export interface User {
  username: string;
  email: string;
  password: string;
}

export interface MyContext {
  token?: string;
}
