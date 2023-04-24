import { type MyContext } from "@/types";

const getUsers = async (context: Required<Pick<MyContext, "prisma">>) => {
  const data = await context.prisma.user.findMany();
  return data;
};

const getUser = async (userId: string, context: Required<Pick<MyContext, "prisma">>) => {
  const data = await context.prisma.user.findUnique({
    where: { userId },
    select: { userId: true, username: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
  return data;
};

export { getUsers, getUser };
