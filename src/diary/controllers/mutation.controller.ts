import { type Diary, type MyContext } from "@/types";

const addDiary = async (data: Diary, context: Required<Pick<MyContext, "prisma">>) => {
  const result = await context.prisma.diary.create({ data });
  return result;
};

const updateDiary = async (data: Diary, context: Required<Pick<MyContext, "prisma">>) => {
  const findDiary = await context.prisma.diary.findFirst({ where: { diaryId: data.diaryId } });
  if (findDiary === null) throw new Error("Diary not found");
  const result = await context.prisma.diary.update({ where: { diaryId: data.diaryId }, data });
  return result;
};

const deleteDiary = async (diaryId: string, context: Required<Pick<MyContext, "prisma">>) => {
  const findDiary = await context.prisma.diary.findFirst({ where: { diaryId } });
  if (findDiary === null) throw new Error("Diary not found");
  const result = await context.prisma.diary.delete({ where: { diaryId } });
  return result;
};

export { addDiary, updateDiary, deleteDiary };
