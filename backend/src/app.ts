import '@config/index'

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import routes from './routes'

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', process.env.UPLOAD_PATH)))
app.use('/v1', routes)

export default app
