import { login, register } from "./controllers/auth.controller";
import { type User, type Auth } from "../types";
import { hash } from "../utils/hash.util";

const resolvers = {
  Mutation: {
    register: async (_: unknown, req: User) => {
      try {
        const data = await register({ username: req.username, email: req.email, password: await hash(req.password) });
        return {
          __typename: "User",
          ...data,
        };
      } catch (error: any) {
        return {
          __typename: "Status",
          status: "ERROR",
          message: error.message ?? "Invalid registration",
        };
      }
    },
    login: async (_: unknown, req: Auth) => {
      try {
        const data = await login(req);
        return {
          __typename: "Token",
          accessToken: data,
        };
      } catch (error: any) {
        return {
          __typename: "Status",
          status: "ERROR",
          message: error.message ?? "Invalid",
        };
      }
    },
  },
};

export default resolvers;
