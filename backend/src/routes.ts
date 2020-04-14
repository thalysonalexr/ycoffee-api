import { Router } from 'express'

import Validator from '@app/middlewares/Validator'
import AuthMiddleware from '@app/middlewares/Auth'
import AuthorizationMiddleware from '@app/middlewares/Authorization'

import UserController from '@domain/controllers/UserController'
import AdminController from '@domain/controllers/AdminController'
import SessionController from '@domain/controllers/SessionController'

import { StoreSession } from '@domain/validators/SessionValidator'
import { StoreUser, UpdateUser } from '@domain/validators/UserValidator'

const routes = Router()

routes.get('/', AuthMiddleware, (req, res) => {
  return res.status(200).json({
    api: process.env.API_NAME,
    version: 'v1'
  })
})

// authentication
routes.post(
  '/session',
  StoreSession.instance(),
  Validator,
  SessionController.store
)
  
// users routes
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

routes.put(
  '/users',
  UpdateUser.instance(),
  Validator,
  AuthMiddleware,
  UserController.update
)

routes.delete(
  '/users',
  AuthMiddleware,
  UserController.remove
)

// dashboard admin
routes.post(
  '/users/:id/disable',
  AuthMiddleware,
  AuthorizationMiddleware,
  AdminController.disable
)

routes.post(
  '/users/:id/enable',
  AuthMiddleware,
  AuthorizationMiddleware,
  AdminController.enable
)

routes.delete(
  '/users/:id',
  AuthMiddleware,
  AuthorizationMiddleware,
  AdminController.remove
)

export default routes
