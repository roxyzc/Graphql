import { login, register, FrefreshToken } from "./controllers/auth.controller";
import { type User, type Auth, type MyContext } from "@/types";
import { hash } from "@/utils/hash.util";
import { verifyToken } from "@/utils/token.util";

const resolvers = {
  Mutation: {
    register: async (_: unknown, req: User, context: MyContext) => {
      try {
        const data = await register(
          {
            username: req.username,
            email: req.email,
            password: await hash(req.password),
          },
          context
        );
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
    login: async (_: unknown, req: Auth, context: MyContext) => {
      try {
        const data = await login(req, context);
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
    refreshToken: async (_: unknown, context: MyContext) => {
      const token = context.token as string;
      try {
        await verifyToken(token, process.env.ACCESSTOKENSECRET as string);
        return {
          __typename: "Status",
          status: "ERROR",
          message: "has not expired",
        };
      } catch (error) {
        try {
          const { accessToken, refreshToken } = await FrefreshToken(token, context);
          return {
            __typename: "Token",
            accessToken,
            refreshToken,
          };
        } catch (error: any) {
          return {
            __typename: "Status",
            status: "ERROR",
            message: error.message ?? "Invalid",
          };
        }
      }
    },
  },
};

export default resolvers;
