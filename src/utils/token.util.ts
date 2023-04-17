import jwt from "jsonwebtoken";
import { type Payload } from "../types";

const generateToken = async (data: Payload) => {
  const accessToken = jwt.sign(data, process.env.ACCESSTOKENSECRET as string, { expiresIn: "1h" });
  const refreshToken = jwt.sign(data, process.env.REFRESHTOKENSECRET as string, { expiresIn: "3h" });
  return await Promise.resolve({ accessToken, refreshToken });
};

export { generateToken };
