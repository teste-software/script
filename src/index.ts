import 'reflect-metadata';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import createContainer from "./container";
import FastifyServer from "./infrastructure/http/Server";

(async () => {
    dotenv.config({ path: path.join(__dirname, '../.env') });
    if (fs.existsSync(`/etc/mongod/55telecom.env.${process.env.NODE_ENV}`)) {
        dotenv.config({
            path: path.resolve(`/etc/mongod/55telecom.env.${process.env.NODE_ENV}`),
        });
    }

    const container = await createContainer();
    const server = container.get(FastifyServer);

    server.start();
})()
