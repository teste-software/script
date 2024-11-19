import Fastify from "fastify";
import { inject, injectable } from "inversify";
import {Router} from "./router/Index";
import cors from '@fastify/cors';

@injectable()
export default class FastifyServer {
  private fastify = Fastify();

  constructor(
      @inject("routers") routers: Router[]
  ) {
    this.fastify.register(cors, {
      origin: (origin, callback) => {
        callback(null, true);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    });

    for (const router of routers) {
      this.fastify.register(router.load(), { prefix: router.prefix })
    }
  }

  start() {
    this.fastify.listen({ port: 3000 }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  }
}
