import { Request } from 'express'
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

type StorageType = { local: multer.StorageEngine }

const storage: StorageType = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', process.env.UPLOAD_PATH))
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, file.originalname)
  
        const fileName = `${hash.toString('hex')}-${file.originalname}`
  
        cb(null, fileName)
      })
    }
  })
}

const config = {
  dest: path.resolve(__dirname, '..', '..', 'tmp', process.env.UPLOAD_PATH),
  storage: storage[process.env.UPLOAD_TYPE],
  limits: { fileSize: +process.env.UPLOAD_SIZE },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
    ]

    if (allowedMimes.includes(file.mimetype))
      cb(null, true)
    else {
      const allowed = allowedMimes.map(mime => mime.replace('image/','')).join(', ')
      cb(new Error(`The type of media sent is not supported. Allowed types ${allowed}`))
    }
  }
}

export default multer(config)
