import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUsers = async () => {
  const data = await prisma.user.findMany();
  return data;
};

const getUser = async (userId: string) => {
  const data = await prisma.user.findUnique({ where: { userId } });
  return data;
};

export { getUsers, getUser };
