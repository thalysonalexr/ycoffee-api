import { Request, Response } from 'express'

import UserService from '@domain/services/UserService'

class UserController {
  public async store(req: Request, res: Response) {
    const { name, email, password } = req.body

    if (await UserService.getByEmail(email))
      return res.status(422).json({ error: 'User already exists.' })

    const user = await UserService.register(name, email, password)
    const data = user?.data(['password']).data

    return res.status(201).json({ user: data })
  }
}

export default new UserController
