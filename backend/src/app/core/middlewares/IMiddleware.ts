import { Request, Response, NextFunction } from 'express'

export interface IMiddleware {
  process(req: Request, res: Response, next: NextFunction): Response<any> | void
}
