import { Request, Response } from 'express'

import UserService from '@domain/services/UserService'
import CoffeeService from '@domain/services/CoffeeService'

export class AdminController {
  public async disableUser(req: Request, res: Response) {
    const { id } = req.params

    if (await UserService.updateRole(id, 'disabled'))
      return res.status(204).end()

    return res.status(404).json({ error: 'User not found.' })
  }

  public async enableUser(req: Request, res: Response) {
    const { id } = req.params

    if (await UserService.updateRole(id, 'user'))
      return res.status(204).end()

    return res.status(404).json({ error: 'User not found.' })
  }

  public async removeUser(req: Request, res: Response) {
    const { id } = req.params

    if (await UserService.remove(id))
      return res.status(204).end()

    return res.status(404).json({ error: 'User not found.' })
  }

  public async destroyCoffee(req: Request, res: Response) {
    const { id } = req.params

    if (await CoffeeService.destroy(id))
      return res.status(204).end()

    return res.status(404).json({ error: 'Coffee not found.' })
  }
}

export default new AdminController
