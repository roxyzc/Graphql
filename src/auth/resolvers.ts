import { register } from "./controllers/auth.controller";
import { type User } from "../types";
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
          __typename: "Error",
          status: "ERROR",
          message: error.message ?? "Invalid registration",
        };
      }
    },
  },
};

export default resolvers;
