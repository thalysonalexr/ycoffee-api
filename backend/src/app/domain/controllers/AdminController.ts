import { Request, Response } from 'express'

import UserService from '@domain/services/UserService'

export class AdminController {
  public async disable(req: Request, res: Response) {
    const { id } = req.params

    if (await UserService.updateRole(id, 'disabled'))
      return res.status(204).end()

    return res.status(404).json({ error: 'User not found.' })
  }

  public async enable(req: Request, res: Response) {
    const { id } = req.params

    if (await UserService.updateRole(id, 'user'))
      return res.status(204).end()

    return res.status(404).json({ error: 'User not found.' })
  }

  public async remove(req: Request, res: Response) {
    const { id } = req.params

    if (await UserService.remove(id))
      return res.status(204).end()

    return res.status(404).json({ error: 'User not found.' })
  }
}

export default new AdminController
