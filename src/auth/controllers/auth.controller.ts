import { PrismaClient } from "@prisma/client";
import { type User } from "../../types";

const prisma = new PrismaClient();

const register = async (values: User) => {
  const findData = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: values.username,
          email: values.email,
        },
        {
          username: values.username,
        },
        {
          email: values.email,
        },
      ],
    },
  });

  if (findData === null) {
    const data = await prisma.user.create({ data: values });
    return data;
  }

  throw new Error("User already exists");
};

export { register };
