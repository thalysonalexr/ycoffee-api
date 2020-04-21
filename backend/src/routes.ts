import { Router } from 'express'

import Auth from '@app/middlewares/Auth'
import Validator from '@app/middlewares/Validator'
import OwnerCoffee from '@app/domain/middlewares/OwnerCoffee'
import Authorization from '@app/middlewares/Authorization'

import UserController from '@domain/controllers/UserController'
import AdminController from '@domain/controllers/AdminController'
import CoffeeController from '@domain/controllers/CoffeeController'
import SessionController from '@domain/controllers/SessionController'

import {
  user,
  coffee,
  session,
  mongoId,
  contentJson,
  authorization
} from '@app/validators/validate'

const routes = Router()

routes.get('/', (req, res) => {
  return res.status(200).json({
    api: process.env.API_NAME,
    version: 'v1',
    docs: 'https://github.com/thalysonalexr/ycoffee/tree/master/docs'
  })
})

// authentication
routes.post(
  '/session',
  [...contentJson, ...session],
  Validator,
  SessionController.store
)

// users routes
routes.post(
  '/users',
  [...contentJson, ...user],
  Validator,
  UserController.store
)

routes.get(
  '/users',
  Auth,
  UserController.profile
)

routes.get(
  '/users/:id',
  mongoId,
  Validator,
  UserController.show
)

routes.put(
  '/users',
  [...authorization, ...contentJson, ...user],
  Validator,
  Auth,
  UserController.update
)

routes.delete(
  '/users',
  Auth,
  UserController.remove
)

// dashboard admin
routes.post(
  '/users/:id/disable',
  mongoId,
  Validator,
  Auth,
  Authorization,
  AdminController.disableUser
)

routes.post(
  '/users/:id/enable',
  mongoId,
  Validator,
  Auth,
  Authorization,
  AdminController.enableUser
)

routes.delete(
  '/users/:id',
  mongoId,
  Validator,
  Auth,
  Authorization,
  AdminController.removeUser
)

routes.delete(
  '/coffee/:id/destroy',
  mongoId,
  Validator,
  Auth,
  Authorization,
  AdminController.destroyCoffee
)

// coffee routes
routes.post(
  '/coffee',
  [...authorization, ...contentJson, ...coffee],
  Validator,
  Auth,
  CoffeeController.store
)

routes.get(
  '/coffee/me',
  Auth,
  CoffeeController.profile
)

routes.get(
  '/coffee/:id',
  mongoId,
  Validator,
  CoffeeController.show
)

routes.get(
  '/coffee',
  CoffeeController.index
)

routes.put(
  '/coffee/:id',
  [...authorization, ...contentJson, ...coffee],
  Validator,
  Auth,
  OwnerCoffee,
  CoffeeController.update
)

routes.delete(
  '/coffee/:id',
  mongoId,
  Validator,
  Auth,
  OwnerCoffee,
  CoffeeController.destroy
)

export default routes
