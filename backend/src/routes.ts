import { Router } from 'express'

import AuthMiddleware from '@app/middlewares/auth'
import Validator from '@app/middlewares/validator'

import UserController from '@app/domain/controllers/UserController'
import SessionController from '@app/domain/controllers/SessionController'

import { StoreUser } from '@domain/validators/UserValidator'
import { StoreSession } from '@domain/validators/SessionValidator'

const routes = Router()

routes.post(
  '/users',
  StoreUser.instance(),
  Validator,
  UserController.store
)

routes.post(
  '/session',
  StoreSession.instance(),
  Validator,
  SessionController.store
)

routes.get('/', AuthMiddleware, (req, res) => {
  return res.status(200).json({
    api: process.env.API_NAME,
    version: 'v1'
  })
})

export default routes
