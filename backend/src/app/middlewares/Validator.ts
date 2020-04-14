import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

import { IMiddleware } from '@app/core/middlewares/IMiddleware'

export class Validator implements IMiddleware {
  public process(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      return next()
    }

    return res.status(400).json({
      error: 'Bad Request.',
      messages: errors.array()
    })
  }
}

export default new Validator().process
