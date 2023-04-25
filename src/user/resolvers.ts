import { verifyToken } from "@/utils/token.util";
import { getUser, getUsers } from "./controllers/get.controller";
import { type MyContext } from "@/types";

const resolvers = {
  Query: {
    dataUsers: async (_parents: unknown, _args: unknown, context: MyContext) => {
      const token = context.token as string;
      try {
        const [, data] = await Promise.all([
          verifyToken(token, process.env.ACCESSTOKENSECRET as string),
          getUsers(context),
        ]);
        return {
          __typename: "Users",
          data,
        };
      } catch (error: unknown) {
        const err = error as Error;
        return {
          __typename: "Status",
          status: "ERROR",
          message: err.message ?? "Unauthorized",
        };
      }
    },

    dataUser: async (_parents: unknown, { id }: { id: string }, context: MyContext) => {
      const token = context.token as string;
      try {
        const [, data] = await Promise.all([
          verifyToken(token, process.env.ACCESSTOKENSECRET as string),
          getUser(id, context),
        ]);

        return {
          __typename: "User",
          ...data,
        };
      } catch (error: unknown) {
        const err = error as Error;
        return {
          __typename: "Status",
          status: "ERROR",
          message: err.message ?? "Unauthorized",
        };
      }
    },
  },
};

export default resolvers;
