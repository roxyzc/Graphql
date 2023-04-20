import jwt from "jsonwebtoken";
import { type Payload } from "@/types";
import "dotenv/config";

// eslint-disable-next-line @typescript-eslint/ban-types
const generateToken = async (data: Payload, x: Boolean = true) => {
  const accessToken = jwt.sign(data, process.env.ACCESSTOKENSECRET as string, { expiresIn: "1h" });
  if (x === false) return await Promise.resolve({ accessToken, refreshToken: "" });
  const refreshToken = jwt.sign(data, process.env.REFRESHTOKENSECRET as string, { expiresIn: "3h" });
  return await Promise.resolve({ accessToken, refreshToken });
};

const verifyToken = async (token: string, SECRET: string) => {
  const data = jwt.verify(token, SECRET) as unknown as {
    id: string;
    role: string;
  };
  return data;
};

export { generateToken, verifyToken };
