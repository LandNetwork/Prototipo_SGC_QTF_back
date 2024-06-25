import { ApolloServer } from '@apollo/server';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { Application } from 'express';
import {DataResolver, JoinedDataResolver, MetadataResolver} from "../resolver/getters";
import {InsertResolver} from "../resolver/setters";

export async function initApollo(app: Application) {
    const schema = await buildSchema({
        resolvers: [MetadataResolver, DataResolver, JoinedDataResolver, InsertResolver],
        validate: false,
    });

    const httpServer = http.createServer(app);
    const apolloServer = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await apolloServer.start();
    return { apolloServer, httpServer };
}
