import 'reflect-metadata';
import express, { Application } from 'express';
import errorHandler from './middlewares/errorHandler';
import { initApollo } from './config/apollo';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import logger from "./config/logger";

export class App {
    public express: Application;
    private httpServer: http.Server | undefined;

    constructor() {
        this.express = express();
        this.middleware();
    }

    public async initialize() {
        const { apolloServer, httpServer } = await initApollo(this.express);
        this.httpServer = httpServer;
        this.express.use(
            '/graphql',
            cors(),
            express.json(),
            expressMiddleware(apolloServer, {
                context: async ({ req }) => ({ token: req.headers.token as string | undefined }),
            })
        );
    }

    public async startServer(port: number) {
        if (!this.httpServer) {
            throw new Error("HTTP server not initialized.");
        }
        await new Promise<void>(resolve => this.httpServer!.listen({ port }, resolve));
        logger.info(`🚀 Server ready at http://localhost:${port}/graphql`);
    }

    private middleware(): void {
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.json());
        this.express.use(errorHandler);
    }
}
