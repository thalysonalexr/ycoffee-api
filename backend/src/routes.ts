import { Router } from 'express'

import Auth from '@app/middlewares/Auth'
import Validator from '@app/middlewares/Validator'
import OwnerCoffee from '@app/domain/middlewares/OwnerCoffee'
import Authorization from '@app/middlewares/Authorization'

import UserController from '@domain/controllers/UserController'
import AdminController from '@domain/controllers/AdminController'
import CoffeeController from '@domain/controllers/CoffeeController'
import SessionController from '@domain/controllers/SessionController'

import { StoreCoffee } from '@domain/validators/CoffeeValidator'
import { StoreSession } from '@domain/validators/SessionValidator'
import { StoreUser, UpdateUser } from '@domain/validators/UserValidator'

const routes = Router()

routes.get('/', (req, res) => {
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
  '/users',
  Auth,
  UserController.profile
)

routes.get(
  '/users/:id',
  UserController.show
)

routes.put(
  '/users',
  UpdateUser.instance(),
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
  Auth,
  Authorization,
  AdminController.disableUser
)

routes.post(
  '/users/:id/enable',
  Auth,
  Authorization,
  AdminController.enableUser
)

routes.delete(
  '/users/:id',
  Auth,
  Authorization,
  AdminController.removeUser
)

routes.delete(
  '/coffee/:id/destroy',
  Auth,
  Authorization,
  AdminController.destroyCoffee
)

// coffee routes
routes.post(
  '/coffee',
  StoreCoffee.instance(),
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
  CoffeeController.show
)

routes.get(
  '/coffee',
  CoffeeController.index
)

routes.put(
  '/coffee/:id',
  StoreCoffee.instance(),
  Validator,
  Auth,
  OwnerCoffee,
  CoffeeController.update
)

routes.delete(
  '/coffee/:id',
  Auth,
  OwnerCoffee,
  CoffeeController.destroy
)

export default routes
