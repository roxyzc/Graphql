import bcrypt from "bcrypt";

const hash = async (candidatePassword: string): Promise<string> => {
  const result = await bcrypt.hash(candidatePassword, 10);
  return result;
};

export { hash };
