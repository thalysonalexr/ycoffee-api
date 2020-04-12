import { Router } from 'express'

import AuthMiddleware from '@app/middlewares/auth'
import Validator from '@app/middlewares/validator'

import UserController from '@domain/controllers/UserController'
import SessionController from '@domain/controllers/SessionController'

import { StoreSession } from '@domain/validators/SessionValidator'
import { StoreUser } from '@domain/validators/UserValidator'

const routes = Router()

routes.get('/', AuthMiddleware, (req, res) => {
  return res.status(200).json({
    api: process.env.API_NAME,
    version: 'v1'
  })
})

routes.post(
  '/users',
  StoreUser.instance(),
  Validator,
  UserController.store
)

routes.get(
  '/users/:id',  
  AuthMiddleware,
  UserController.show
)

routes.post(
  '/session',
  StoreSession.instance(),
  Validator,
  SessionController.store
)

export default routes
