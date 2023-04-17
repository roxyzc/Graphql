import { PrismaClient } from "@prisma/client";
import { type Auth, type User } from "../../types";
import { compare } from "../../utils/hash.util";
import { generateToken } from "../../utils/token.util";

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

const login = async (values: Auth): Promise<string | null> => {
  const findUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: values.usernameOrEmail,
        },
        {
          email: values.usernameOrEmail,
        },
      ],
    },
  });

  if (findUser === null) {
    throw new Error("user not found");
  }

  if (!(await compare(values.password, findUser.password))) {
    throw new Error("Password not match");
  }

  const token = await prisma.token.findUnique({ where: { userId: findUser.userId } });
  if (token !== null) {
    return token.accessToken;
  }

  const { accessToken, refreshToken } = await generateToken({ id: findUser.userId, role: findUser.role });
  await prisma.token.create({
    data: {
      accessToken,
      refreshToken,
      userId: findUser.userId,
    },
  });

  return accessToken;
};

export { register, login };
