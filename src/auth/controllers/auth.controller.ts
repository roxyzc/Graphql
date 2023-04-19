import { PrismaClient } from "@prisma/client";
import { type Auth, type User } from "../../types";
import { compare } from "../../utils/hash.util";
import { generateToken, verifyToken } from "../../utils/token.util";

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

const FrefreshToken = async (token: string) => {
  const findAccessToken = await prisma.token.findFirst({
    where: { accessToken: token },
    select: { tokenId: true, accessToken: true, refreshToken: true, user: { select: { userId: true, role: true } } },
  });
  if (findAccessToken === null) throw new Error("unauthorized");
  const data = await verifyToken(findAccessToken.refreshToken, process.env.REFRESHTOKENSECRET as string);
  if (data !== null) {
    const { accessToken } = await generateToken({ id: data.id, role: data.role }, false);
    await prisma.token.update({
      where: {
        tokenId: findAccessToken.tokenId,
      },
      data: { accessToken },
    });
    return await Promise.resolve({ accessToken, refreshToken: null });
  }
  const { accessToken, refreshToken } = await generateToken(
    { id: findAccessToken.user?.userId as string, role: findAccessToken.user?.role as string },
    true
  );
  await prisma.token.update({
    where: {
      tokenId: findAccessToken.tokenId,
    },
    data: { accessToken, refreshToken },
  });
  return await Promise.resolve({ accessToken, refreshToken });
};

export { register, login, FrefreshToken };
