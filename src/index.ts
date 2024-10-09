import 'reflect-metadata';
import createContainer from "./container";
import FastifyServer from "./infrastructure/http/Server";

(async () => {
    const container = await createContainer();
    const server = container.get(FastifyServer);

    server.start();
})()
