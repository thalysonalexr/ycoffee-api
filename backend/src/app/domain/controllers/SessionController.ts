import { Request, Response } from 'express'

import UserService from '@domain/services/UserService'

class SessionController {
  public async store(req: Request, res: Response) {
    const { email, password } = req.body

    const user = await UserService.getByEmail(email)

    if (!user)
      return res.status(401).json({ error: 'User not exists.' })

    if (!user.password.compare(password))
      return res.status(401).json({ error: 'Wrong password.' })

    const token = UserService.generateUserToken(user.id)
    const udata = user.data(['password']).data

    return res.status(200).json({ user: udata, token })
  }
}

export default new SessionController
