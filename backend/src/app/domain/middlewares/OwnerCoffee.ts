import { Request, Response, NextFunction } from 'express'

import { IMiddleware } from '@core/middlewares/IMiddleware'

import { UserEntity } from '@domain/entity/UserEntity'
import CoffeeService from '@domain/services/CoffeeService'
import { ObjectID } from '../values/Mongo'

export class OwnerCoffee implements IMiddleware {
  public async process(req: Request, res: Response, next: NextFunction) {
    const { id: owner } = req.session
    const { id } = req.params

    const coffee = await CoffeeService.getById(id)

    if (!coffee)
      return res.status(404).json({ error: 'Resource not found.' })

    let resourceOwner = (coffee.author as UserEntity).id

    if (resourceOwner instanceof ObjectID) {

      if (resourceOwner.toString() !== owner)
        return res.status(403).json({ error: 'Forbidden' })

      return next()
    }

    return res.status(503).json({ error: 'Service unavailable.' })
  }
}

export default new OwnerCoffee().process
