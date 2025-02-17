import https from "https";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import enforcesSsl from "express-enforces-ssl";

import { Logger } from "winston";
import { inject, injectable } from "inversify";

import { Router } from './router'
import { injectSSL } from "./injectSSL";

@injectable()
export default class Server {

  private routers: Router[];
  readonly logger: Logger;

  constructor(
      @inject("routers") routers: Router[],
      @inject("logger") logger: Logger,
  ) {
    this.routers = routers;
    this.logger = logger;
  }

  public createServerAndListen(port: number) {
    const app = express();
    app.enable('trust proxy');
    app.use(bodyParser.json({ "limit": '50mb' }));
    app.use(bodyParser.urlencoded({ "extended": false, "limit": '50mb' }));
    app.use(compression());
    app.use(helmet({ 'frameguard': false }));
    app.use(cors({ 'origin': '*', 'credentials': true, 'exposedHeaders': 'X-Total-Count' }));
    app.use(enforcesSsl());

    app.enabled('trust proxy');

    for (const router of this.routers) router.load(app);

    const server = https.createServer(app);
    injectSSL(server);

    app.set('port', port);
    server.listen(port);

    this.logger.info(`HTTPS server running at port ${port}`);
  }
}
