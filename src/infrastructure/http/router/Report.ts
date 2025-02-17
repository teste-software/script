import {Router} from "./index";
import {Router as newRouter, IRouter} from "express";
import {inject, injectable, named} from "inversify";
import ReportController from "../controller/Report";
import Middleware from "../middleware";

@injectable()
export default class ReportRouter implements Router {
    controller: ReportController
    authJWT: Middleware

    constructor(
        @inject(ReportController) controller: ReportController,
        @inject(Middleware) @named("jwt") authJWT: Middleware,
    ) {
        this.controller = controller;
        this.authJWT = authJWT;
    }

    load(app: IRouter) {
        const router = newRouter();

        router.get("/clientsNames", this.authJWT, this.controller.getActiveClientsNames.bind(this.controller));
        router.post("/calls", this.authJWT, this.controller.getReportCalls.bind(this.controller));


        app.use('/api/report' ,router);
    }
}









