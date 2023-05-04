import { type MyContext, type Auth, type User, type STATUS_USER, type Token, type Message, type STATUS } from "@/types";
import { encode, compare } from "@/utils/hash.util";
import { generateToken, verifyToken } from "../../utils/token.util";
import { generateNumber } from "@/utils/generateNumbers.util";
import { addHours } from "@/utils/generateDate.util";
import { sendEmail, mailOptions } from "@/utils/sendEmail.util";
import { type PrismaClient } from "@prisma/client";

const register = async (values: User, context: Required<Pick<MyContext, "prisma">>) => {
  const findUser = await context.prisma.user.findFirst({
    where: {
      OR: [{ username: values.username }, { email: values.email }],
    },
  });

  // eslint-disable-next-line @typescript-eslint/return-await
  return context.prisma.$transaction(async (tx: PrismaClient) => {
    try {
      if (findUser === null) {
        const data = await tx.user.create({
          data: {
            username: values.username,
            password: values.password,
            email: values.email,
            expiredAt: new Date(addHours(new Date(), 2)),
          },
        });
        const otp = generateNumber(6);
        const content = await mailOptions("Verify your email", data.email, "OTP", `<h3>${otp}</h3>`);

        const [, valid] = await Promise.all([
          tx.otp.create({
            data: { otp: encode(otp), userId: data.userId, expiredAt: new Date(addHours(new Date(), 2)) },
          }),
          sendEmail(content),
        ]);

        if (!valid) throw new Error("Send Email failed");

        return data;
      }
      throw new Error("user already exists");
    } catch (error: unknown) {
      const err = error as Error;
      throw new Error(err.message);
    }
  });
};

const verifyUser = async (otp: string, context: Required<Pick<MyContext, "prisma">>): Promise<Message> => {
  const [findOtp, ,] = await Promise.all([
    context.prisma.otp.findFirst({
      where: {
        otp: encode(otp),
        expiredAt: {
          gte: new Date(),
        },
      },
    }),
    context.prisma.otp.deleteMany({
      where: {
        OR: [
          {
            expiredAt: {
              lte: new Date(),
            },
          },
          {
            otp: encode(otp),
          },
        ],
      },
    }),
    context.prisma.user.deleteMany({
      where: {
        expiredAt: {
          lte: new Date(),
        },
      },
    }),
  ]);

  if (findOtp === null) throw new Error("Otp not found");
  try {
    await context.prisma.user.update({
      where: { userId: findOtp.userId },
      data: { status: "ACTIVE" as unknown as STATUS_USER, expiredAt: null },
    });

    return { message: "successfully activated the user", status: "OK" as unknown as STATUS };
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? "Could not activate the user");
  }
};

const generateOTP = async (usernameOrEmail: string, context: Required<Pick<MyContext, "prisma">>) => {
  const findUser = await context.prisma.user.findFirst({
    where: {
      OR: [
        { username: usernameOrEmail, status: "PENDING" as unknown as STATUS_USER },
        { email: usernameOrEmail, status: "PENDING" as unknown as STATUS_USER },
      ],
    },
    select: { userId: true, email: true, Otp: { select: { otp: true, createdAt: true } } },
  });

  if (findUser === null) throw new Error("user not found");
  if (findUser.Otp?.createdAt !== null && findUser.Otp?.createdAt.getTime() > new Date().getTime() - 60000)
    throw new Error("wait 1 minute");
  return context.prisma.$transaction(async (tx: PrismaClient) => {
    try {
      const otp = generateNumber(6);
      const content = await mailOptions("Verify your email", findUser.email, "OTP", `<h3>${otp}</h3>`);
      const [, , valid] = await Promise.all([
        tx.otp.deleteMany({
          where: {
            OR: [
              {
                expiredAt: {
                  lte: new Date(),
                },
              },
              {
                userId: findUser.userId,
              },
            ],
          },
        }),
        tx.otp.create({
          data: { otp: encode(otp), userId: findUser.userId, expiredAt: new Date(addHours(new Date(), 2)) },
        }),
        sendEmail(content),
      ]);

      if (!valid) throw new Error("Send Email failed");
      return "otp resent successfully";
    } catch (error: unknown) {
      const err = error as Error;
      throw new Error(err.message);
    }
  });
};

const login = async (values: Auth, context: Required<Pick<MyContext, "prisma">>): Promise<string | null> => {
  const findUser = await context.prisma.user.findFirst({
    where: {
      OR: [{ username: values.usernameOrEmail }, { email: values.usernameOrEmail }],
    },
  });

  if (findUser === null) throw new Error("user not found");
  if (findUser.status === ("PENDING" as unknown as STATUS_USER)) throw new Error("user in pending status");
  if (!(await compare(values.password, findUser.password))) throw new Error("Password not match");

  const token = await context.prisma.token
    .findUnique({ where: { userId: findUser.userId } })
    .then(async (payload: Token) => {
      if (payload !== null) return payload.accessToken;
      const { accessToken, refreshToken } = await generateToken({ id: findUser.userId, role: findUser.role });
      await context.prisma.token.create({
        data: {
          accessToken,
          refreshToken,
          userId: findUser.userId,
        },
      });
      return accessToken;
    });
  return token;
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

export { register, login, FrefreshToken, verifyUser, generateOTP };
