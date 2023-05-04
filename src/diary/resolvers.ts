import { type Payload, type Diary, type MyContext } from "@/types";
import { verifyToken } from "@/utils/token.util";
import { addDiary, deleteDiary, updateDiary } from "./controllers/mutation.controller";
import { getDiaries, getDiariesByUserId, getDiary } from "./controllers/query.controller";

const resolvers = {
  Mutation: {
    addDiary: async (_: unknown, data: Diary, context: MyContext) => {
      const token = context.token as string;
      try {
        const payload: Payload = await verifyToken(token, process.env.ACCESSTOKENSECRET as string);
        Object.assign(data, { userId: payload.id });

        const result = await addDiary(data, context);
        return {
          __typename: "Diary",
          ...result,
        };
      } catch (error: unknown) {
        const err = error as Error;
        return {
          __typename: "Status",
          status: "ERROR",
          message: err.message ?? "Server internal error",
        };
      }
    },

    updateDiary: async (
      _: unknown,
      data: Required<Pick<Diary, "title" | "content" | "status_diary" | "diaryId">>,
      context: MyContext
    ) => {
      const token = context.token as string;
      try {
        const [, result] = await Promise.all([
          verifyToken(token, process.env.ACCESSTOKENSECRET as string),
          updateDiary(data, context),
        ]);

        return {
          __typename: "Diary",
          ...result,
        };
      } catch (error: unknown) {
        const err = error as Error;
        return {
          __typename: "Status",
          status: "ERROR",
          message: err.message ?? "Server internal error",
        };
      }
    },

    deleteDiary: async (_: unknown, { diaryId }: { diaryId: string }, context: MyContext) => {
      const token = context.token as string;
      try {
        const [, result] = await Promise.all([
          verifyToken(token, process.env.ACCESSTOKENSECRET as string),
          deleteDiary(diaryId, context),
        ]);

        return {
          __typename: "Diary",
          ...result,
        };
      } catch (error: unknown) {
        const err = error as Error;
        return {
          __typename: "Status",
          status: "ERROR",
          message: err.message ?? "Server internal error",
        };
      }
    },
  },

  Query: {
    getDiary: async (_: unknown, { diaryId }: { diaryId: string }, context: MyContext) => {
      const token = context.token as string;
      try {
        const [, data] = await Promise.all([
          verifyToken(token, process.env.ACCESSTOKENSECRET as string),
          getDiary(diaryId, context),
        ]);
        return {
          __typename: "Diary",
          ...data,
        };
      } catch (error) {
        const err = error as Error;
        return {
          __typename: "Status",
          status: "ERROR",
          message: err.message ?? "Server internal error",
        };
      }
    },
    getDiaries: async (_: unknown, _data: unknown, context: MyContext) => {
      const token = context.token as string;
      try {
        const [, data] = await Promise.all([
          verifyToken(token, process.env.ACCESSTOKENSECRET as string),
          getDiaries(context),
        ]);
        return {
          __typename: "Diaries",
          data,
        };
      } catch (error) {
        const err = error as Error;
        return {
          __typename: "Status",
          status: "ERROR",
          message: err.message ?? "Server internal error",
        };
      }
    },
    getDiariesByUserId: async (_: unknown, _data: unknown, context: MyContext) => {
      const token = context.token as string;
      try {
        const payload: Payload = await verifyToken(token, process.env.ACCESSTOKENSECRET as string);
        const data = await getDiariesByUserId(payload.id, context);
        return {
          __typename: "Diaries",
          data,
        };
      } catch (error) {
        const err = error as Error;
        return {
          __typename: "Status",
          status: "ERROR",
          message: err.message ?? "Server internal error",
        };
      }
    },
  },
};

export default resolvers;
