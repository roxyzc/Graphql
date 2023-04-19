import { verifyToken } from "../utils/token.util";
import { getUser, getUsers } from "./controllers/get.controller";

const resolvers = {
  Query: {
    dataUsers: async (_parents: unknown, _args: unknown, context: { token: string }) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, promise/valid-params
        const [, data] = await Promise.all([
          verifyToken(context.token, process.env.ACCESSTOKENSECRET as string),
          getUsers(),
        ]);
        return {
          __typename: "Users",
          data,
        };
      } catch (error: any) {
        return {
          __typename: "Status",
          status: "ERROR",
          message: error.message ?? "Unauthorized",
        };
      }
    },

    dataUser: async (_parents: unknown, { id }: { id: string }, context: { token: string }) => {
      try {
        const [, data] = await Promise.all([
          verifyToken(context.token, process.env.REFRESHTOKENSECRET as string),
          getUser(id),
        ]);

        return {
          __typename: "Users",
          ...data,
        };
      } catch (error: any) {
        return {
          __typename: "Status",
          status: "ERROR",
          message: error.message ?? "Unauthorized",
        };
      }
    },
  },
};

export default resolvers;
