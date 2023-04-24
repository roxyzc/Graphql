import bcrypt from "bcrypt";
import Hashids from "hashids";
import "dotenv/config";

const hashids = new Hashids(process.env.SALT as string, 10);

const hash = async (candidatePassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const result = await bcrypt.hash(candidatePassword, salt);
  return result;
};

const compare = async (candidatePassword: string, password: string): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, password).catch(() => false);
};

const encode = (candidate: string): string => {
  const result = hashids.encode(candidate);
  return result;
};

const decode = (candidate: string): string => {
  const result = String(hashids.decode(candidate)[0]);
  return result;
};

export { hash, compare, encode, decode };
