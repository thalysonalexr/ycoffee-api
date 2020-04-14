import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import { IMiddleware } from '@core/middlewares/IMiddleware'

export class Auth implements IMiddleware {
  public process(req: Request, res: Response, next: NextFunction): Response<any> | void {
    const header = req.headers.authorization
    
    if (!header)
      return res.status(401).json({ error: 'No token provided.' })

    const parts = header.split(' ')

    if (parts.length !== 2)
      return res.status(401).json({ error: 'Error token.' })

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme))
      return res.status(401).json({ error: 'Token malformatted.' })

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err)
        return res.status(401).json({ error: 'Token invalid.' })

      req.session = <Express.TokenDecoded>decoded

      return next()
    })
  }
}

export default new Auth().process
