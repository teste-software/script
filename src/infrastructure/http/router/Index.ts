import {FastifyError, FastifyInstance, FastifyRegisterOptions} from "fastify";


export interface Router {
    prefix: string
    load: () => (instance: FastifyInstance, opts:  FastifyRegisterOptions<{ prefix: string }>, done: (err?: FastifyError) => void) => void
}
