import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express, { type Application } from "express";
import { join } from "node:path";
import http from "http";
import cors from "cors";
import { json } from "body-parser";
import resolvers from "./resolvers";
import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { type MyContext } from "./types";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const p = new PrismaClient();
const main = async () => {
  const app: Application = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<MyContext>({
    typeDefs: await loadSchema(join(__dirname, "../schema.graphql"), {
      loaders: [new GraphQLFileLoader()],
    }),
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<any> => {
        const token = req.headers.authorization ?? null;
        const prisma = p;
        return { token, prisma };
      },
    })
  );
  await new Promise<void>((resolve) => httpServer.listen({ port: 8000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:8000/graphql`);
};

main()
  // eslint-disable-next-line promise/always-return
  .then(async () => {
    await p.$disconnect();
  })
  .catch(async (error) => {
    await p.$disconnect();
    console.error(error);
    process.exit(1);
  });
