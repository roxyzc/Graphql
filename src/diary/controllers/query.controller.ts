import { type STATUS_DIARY, type MyContext } from "@/types";

const getDiary = async (diaryId: string, context: Required<Pick<MyContext, "prisma">>) => {
  const result = await context.prisma.diary.findFirst({ where: { diaryId } });
  return result;
};

const getDiaries = async (context: Required<Pick<MyContext, "prisma">>) => {
  const result = await context.prisma.diary.findMany({
    where: { status_diary: "PUBLIC" as unknown as STATUS_DIARY },
  });
  return result;
};

const getDiariesByUserId = async (userId: string, context: Required<Pick<MyContext, "prisma">>) => {
  const result = await context.prisma.diary.findMany({ where: { userId } });
  return result;
};

export { getDiariesByUserId, getDiaries, getDiary };
