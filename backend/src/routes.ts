import { Router } from 'express'

import AuthMiddleware from '@app/middlewares/auth'
import UserController from '@app/domain/controllers/UserController'
import SessionController from '@app/domain/controllers/SessionController'

const routes = Router()

routes.post('/users', UserController.store)
routes.post('/session', SessionController.store)

routes.get('/', AuthMiddleware, (req, res) => {
  return res.status(200).json({
    api: process.env.API_NAME,
    version: 'v1'
  })
})

export default routes
