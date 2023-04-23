import { type MyContext, type Auth, type User } from "@/types";
import { compare } from "@/utils/hash.util";
import { generateToken, verifyToken } from "../../utils/token.util";
import { generateNumber } from "@/utils/generateOtp.util";
import { sendEmail, mailOptions } from "@/utils/sendEmail.util";

const register = async (values: User, context: Required<Pick<MyContext, "prisma">>) => {
  const findData = await context.prisma.user.findFirst({
    where: {
      OR: [{ username: values.username }, { email: values.email }],
    },
  });

  // eslint-disable-next-line @typescript-eslint/return-await
  return context.prisma.$transaction(async (tx: any) => {
    try {
      if (findData === null) {
        const data = await tx.prisma.user.create({ data: values });
        const otp = generateNumber(6);
        const content = await mailOptions("Verify your email", data.email, "OTP", `<h3>${otp}</h3>`);

        const [,] = await Promise.all([
          tx.prisma.otp.create({ data: { otp, userId: data.userId } }),
          sendEmail(content),
        ]).catch((err) => {
          throw new Error(err);
        });
        return data;
      }
      throw new Error("user already exists");
    } catch (error: any) {
      await context.prisma.$transactionRollback(tx);
      throw new Error(error.message);
    }
  });
};

const login = async (values: Auth, context: Required<Pick<MyContext, "prisma">>): Promise<string | null> => {
  const findUser = await context.prisma.user.findFirst({
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
    await context.prisma.$disconnect();
    throw new Error("user not found");
  }

  if (!(await compare(values.password, findUser.password))) {
    throw new Error("Password not match");
  }

  const token = await context.prisma.token.findUnique({ where: { userId: findUser.userId } });
  if (token !== null) {
    return token.accessToken;
  }

  const { accessToken, refreshToken } = await generateToken({ id: findUser.userId, role: findUser.role });
  await context.prisma.token.create({
    data: {
      accessToken,
      refreshToken,
      userId: findUser.userId,
    },
  });

  return accessToken;
};

const FrefreshToken = async (token: string, context: Required<Pick<MyContext, "prisma">>) => {
  const findAccessToken = await context.prisma.token.findFirst({
    where: { accessToken: token },
    select: { tokenId: true, accessToken: true, refreshToken: true, user: { select: { userId: true, role: true } } },
  });
  if (findAccessToken === null) throw new Error("unauthorized");
  const data = await verifyToken(findAccessToken.refreshToken, process.env.REFRESHTOKENSECRET as string)
    .then(async (data) => {
      const { accessToken } = await generateToken({ id: data.id, role: data.role }, false);
      await context.prisma.token.update({
        where: {
          tokenId: findAccessToken.tokenId,
        },
        data: { accessToken },
      });
      return { accessToken, refreshToken: null };
    })
    .catch(async () => {
      const { accessToken, refreshToken } = await generateToken(
        { id: findAccessToken.user?.userId as string, role: findAccessToken.user?.role as string },
        true
      );
      await context.prisma.token.update({
        where: {
          tokenId: findAccessToken.tokenId,
        },
        data: { accessToken, refreshToken },
      });
      return { accessToken, refreshToken };
    });
  return await Promise.resolve({ accessToken: data.accessToken, refreshToken: data.refreshToken });
};

export { register, login, FrefreshToken };
