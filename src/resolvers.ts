import auth from "./auth/resolvers";
import user from "./user/resolvers";

const resolvers = {
  ...auth,
  ...user,
};

export default resolvers;
