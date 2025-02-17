import { IRouter } from "express";

export interface Router {
    load: (app: IRouter) => void;
}
