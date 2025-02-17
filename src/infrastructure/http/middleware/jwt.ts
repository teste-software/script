import { JwtMiddleware } from '@55telecom/55tec_util_lib/lib/server/express/middleware/jwt';
import { NextFunction, Request, Response } from "express";

import Middleware from './';


export function getMiddleware() {
    return async function middleware(req: Request, res: Response, next?: NextFunction) {
        try {
            const jwtMiddPaths = { userId: 'headers.user_logged', clientId: 'headers.client_logged' };
            req.url = req.body.route;

            const jwtMidd = new JwtMiddleware(jwtMiddPaths);

            // @ts-ignore
            return await jwtMidd.use(req, res, next);
        } catch (err: any) {
            return res.status(err.code || 403).json(err);
        }
    };
}

export default Middleware;
