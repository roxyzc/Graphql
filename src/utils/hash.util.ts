import bcrypt from "bcrypt";

const hash = async (candidatePassword: string): Promise<string> => {
  const result = await bcrypt.hash(candidatePassword, 10);
  return result;
};

const compare = async (candidatePassword: string, password: string): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, password).catch(() => false);
};

export { hash, compare };
