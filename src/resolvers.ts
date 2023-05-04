import auth from "./auth/resolvers";
import user from "./user/resolvers";
import diary from "./diary/resolvers";

const resolvers = {
  Mutation: {
    ...auth.Mutation,
    ...diary.Mutation,
  },
  Query: {
    ...user.Query,
    ...diary.Query,
  },
};

export default resolvers;
