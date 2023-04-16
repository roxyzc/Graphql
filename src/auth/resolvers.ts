import { register } from "./controllers/auth.controller";
import { type User } from "../types";

const resolvers = {
  Mutation: {
    register: async (_: unknown, req: User) => {
      try {
        const data = await register(req);
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
