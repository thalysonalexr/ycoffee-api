import { Request, Response, NextFunction } from 'express'
import { MulterError } from 'multer'

import multer from '@config/multer'

import { IMiddleware } from '@core/middlewares/IMiddleware'

class Multer implements IMiddleware {
  private static upload = multer.single('image')

  public async process(req: Request, res: Response, next: NextFunction) {
    await Multer.upload(req, res, (err) => {
      if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE')
        return res.status(413).json({ error: 'The file exceeds the allowed size.' })

      if (err instanceof Error)
        return res.status(415).json({ error: err.message })

      return next()
    })
  }
}

export default new Multer().process
