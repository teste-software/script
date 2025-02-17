// import {FastifyError, FastifyInstance, FastifyPluginCallback, FastifyRegisterOptions} from "fastify";
// import {Router} from "./Index";
// import {inject, injectable} from "inversify";
// import ValidateEventsController from "../controller/ValidateEvents";
//
// @injectable()
// export default class ValidateEventsRouter implements Router {
//     prefix = 'validate-call';
//     controller: ValidateEventsController
//
//     constructor(
//         @inject(ValidateEventsController) controller: ValidateEventsController
//     ) {
//         this.controller = controller;
//     }
//
//     load(): FastifyPluginCallback {
//         return (instance, opts, done) => {
//             instance.get("/:call_id/:client_id", this.controller.validateCallId.bind(this.controller));
//             instance.get("/processed", this.controller.getValidateEvents.bind(this.controller));
//             done();
//         }
//     }
// }
