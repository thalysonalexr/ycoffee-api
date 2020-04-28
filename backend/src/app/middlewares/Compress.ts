import { Request, Response, NextFunction } from 'express'
import { promisify } from 'util'
import jimp from 'jimp'
import fs from 'fs'

import { IMiddleware } from '@core/middlewares/IMiddleware'

export class Compress implements IMiddleware {
  public async process(req: Request, res: Response, next: NextFunction) {
    const newPath = `${req.file.path.split('.')[0]}.webp`

    const file = await jimp.read(req.file.path)

    await file
      .resize(400, jimp.AUTO)
      .quality(90)
      .writeAsync(newPath)

    await promisify(fs.unlink)(req.file.path)

    req.file.filename = `${req.file.filename.split('.')[0]}.webp`

    return next()
  }
}

export default new Compress().process
