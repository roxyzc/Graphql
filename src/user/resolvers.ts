import { type Payload } from "../types";
import { getUser, getUsers } from "./controllers/get.controller";

const resolvers = {
  Query: {
    dataUsers: async (_parents: unknown, _args: unknown, context: { payload: Payload }) => {
      if (context.payload === undefined) {
        return {
          __typename: "Status",
          status: "ERROR",
          message: "Unauthorized",
        };
      }
      const data = await getUsers();
      return {
        __typename: "Users",
        data,
      };
    },

    dataUser: async (_parents: unknown, { id }: { id: string }, context: { payload: Payload }) => {
      if (context.payload === undefined) {
        return {
          __typename: "Status",
          status: "ERROR",
          message: "Unauthorized",
        };
      }
      const data = await getUser(id);
      return {
        __typename: "Users",
        ...data,
      };
    },
  },
};

export default resolvers;
