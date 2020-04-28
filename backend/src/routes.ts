import { Router } from 'express'

import Auth from '@app/middlewares/Auth'
import Multer from '@app/middlewares/Multer'
import Compress from '@app/middlewares/Compress'
import Validator from '@app/middlewares/Validator'
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
  formData,
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

routes.put(
  '/users/avatar',
  Multer,
  Compress,
  [...authorization, ...formData],
  Validator,
  Auth,
  UserController.storeAvatar
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
  '/coffees/:id/destroy',
  mongoId,
  Validator,
  Auth,
  Authorization,
  AdminController.destroyCoffee
)

// coffee routes
routes.post(
  '/coffees',
  [...authorization, ...contentJson, ...coffee],
  Validator,
  Auth,
  CoffeeController.store
)

routes.put(
  '/coffees/:id/image',
  Multer,
  Compress,
  [...authorization, ...formData, ...mongoId],
  Validator,
  Auth,
  CoffeeController.storeImage
)

routes.get(
  '/coffees/me',
  Auth,
  CoffeeController.profile
)

routes.get(
  '/coffees/:id',
  mongoId,
  Validator,
  CoffeeController.show
)

routes.get(
  '/coffees',
  CoffeeController.index
)

routes.put(
  '/coffees/:id',
  [...authorization, ...contentJson, ...coffee],
  Validator,
  Auth,
  CoffeeController.update
)

routes.delete(
  '/coffees/:id',
  mongoId,
  Validator,
  Auth,
  CoffeeController.destroy
)

export default routes
