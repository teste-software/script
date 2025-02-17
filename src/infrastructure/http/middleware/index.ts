import { NextFunction, Request, Response } from "express";

// for binding purposes only
export const Middleware = (req: Request, res: Response, next: NextFunction) => next();
export default Middleware;

export type Middleware = (req: Request, res: Response, next: NextFunction) => any;

export const Factory = (...args: any[]) => Middleware;
export type Factory = (...args: any[]) => Middleware;
