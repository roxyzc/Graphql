export {};

export interface User {
  username: string;
  email: string;
  password: string;
}

export interface Context {
  payload?: Record<string, any, null>;
}

export interface Payload {
  id: string;
  role: string;
}
