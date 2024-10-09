import {FastifyError, FastifyInstance, FastifyRegisterOptions} from "fastify";
import {Router} from "./Index";
import {inject, injectable} from "inversify";
import ValidateEventsController from "../controller/ValidateEvents";

@injectable()
export default class ValidateEventsRouter implements Router {
    prefix = 'validate-call';
    controller: ValidateEventsController

    constructor(
        @inject(ValidateEventsController) controller: ValidateEventsController
    ) {
        this.controller = controller;
    }

    load() {

        return (instance: FastifyInstance, opts:  FastifyRegisterOptions<{ prefix: string }>, done: (err?: FastifyError) => void) => {
            instance.get("/:call_id", this.controller.validateCallId.bind(this.controller.validateCallId));

            done();
        }
    }
}
