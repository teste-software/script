import {Router} from "./index";
import {Router as newRouter, IRouter} from "express";
import {inject, injectable, named} from "inversify";
import ReportController from "../controller/Report";
import Middleware from "../middleware";
import ProcessedCallController from "../controller/ProcessedCall";

@injectable()
export default class ProcessedCallRouter implements Router {
    controller: ProcessedCallController
    authJWT: Middleware

    constructor(
        @inject(ProcessedCallController) controller: ProcessedCallController,
        @inject(Middleware) @named("jwt") authJWT: Middleware,
    ) {
        this.controller = controller;
        this.authJWT = authJWT;
    }

    load(app: IRouter) {
        const router = newRouter();

        router.get("/:call_id/:client_id", this.authJWT, this.controller.processedCall.bind(this.controller));
        app.use('/api/processed' ,router);
    }
}









