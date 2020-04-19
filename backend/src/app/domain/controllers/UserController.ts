import { Request, Response } from 'express'

import UserService from '@domain/services/UserService'

class UserController {
  public async store(req: Request, res: Response) {
    const { name, email, password } = req.body

    if (await UserService.getByEmail(email))
      return res.status(422).json({ error: 'User already exists.' })

    const user = await UserService.register(name, email, password)

    const token = UserService.generateUserToken({
      id: (user.id as object).toString(),
      role: (user.role as object).toString()
    })

    return res.status(201).json({ user: user.data('password'), token })
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params

    const user = await UserService.getById(id)

    if (!user)
      return res.status(404).json({ error: 'User not found.' })

    return res.status(200).json({
      user: user.data('email', 'password', 'role', 'createdAt', 'updatedAt')
    })
  }

  public async profile(req: Request, res: Response) {
    const { id } = req.session

    const user = await UserService.getById(id)

    if (!user)
      return res.status(404).json({ error: 'User not found.' })

    return res.status(200).json({
      user: user.data('password')
    })
  }

  public async update(req: Request, res: Response) {
    const { id } = req.session
    const { name, email, password } = req.body

    const user = await UserService.update(id, name, email, password)

    if (!user)
      return res.status(404).json({ error: 'User not found.' })

    return res.status(200).json({ user: user.data('password') })
  }

  public async remove(req: Request, res: Response) {
    const { id } = req.session

    if (await UserService.remove(id))
      return res.status(204).end()

    return res.status(404).json({ error: 'User not found.' })
  }
}

export default new UserController
