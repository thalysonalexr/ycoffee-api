import { Request, Response, NextFunction } from 'express'

import { IMiddleware } from '@core/middlewares/IMiddleware'

export class Authorization implements IMiddleware {
  public process(req: Request, res: Response, next: NextFunction): Response<any> | void {
    const { role } = req.session

    if (role === 'admin') {
      return next()
    }

    return res.status(403).json({ error: 'Forbidden.' })
  }
}

export default new Authorization().process
