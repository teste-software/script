import 'reflect-metadata';
import './boot/config';
import createContainer from "./container";
import config from 'config';
import HttpServer from "./infrastructure/http/Server";
import CronJob from "./infrastructure/cron";

(async () => {

    const container = await createContainer();
    const cron = container.get(CronJob);
    const server = container.get(HttpServer);

    server.createServerAndListen(config.get("server.https.port"));
    // cron.start();
})()
