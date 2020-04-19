import { Request, Response } from 'express'

import CoffeeService from '@domain/services/CoffeeService'

export class CoffeeController {
  public async store(req: Request, res: Response) {
    const { id: author } = req.session
    const {
      type,
      description,
      ingredients,
      preparation,
      timePrepare,
      portions,
      picture,
    } = req.body

    const coffee = await CoffeeService.create({
      type,
      description,
      ingredients,
      preparation,
      timePrepare,
      portions,
      picture,
      author
    })

    return res.status(201).json({ coffee: coffee.data() })
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params

    const coffee = await CoffeeService.getById(id)

    if (!coffee)
      return res.status(404).json({ error: 'Coffee not found.' })

    return res.status(200).json({ coffee: coffee.data() })
  }

  public async profile(req: Request, res: Response) {
    const { page = 1 } = req.query
    const { id } = req.session

    const cafes = await CoffeeService.getAllByAuthor(page, id)

    return res.status(200).json(cafes)
  }

  public async index(req: Request, res: Response) {
    const { page = 1, type } = req.query

    if (!type)
      return res.status(200).json(
        await CoffeeService.getAllBy(page)
      )

    return res.status(200).json(
      await CoffeeService.getAllByType(page, type)
    )
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params
    const { id: author } = req.session
    const {
      type,
      description,
      ingredients,
      preparation,
      timePrepare,
      portions,
      picture,
    } = req.body

    const coffee = await CoffeeService.update(id, {
      type,
      description,
      ingredients,
      preparation,
      timePrepare,
      portions,
      picture,
      author
    })

    return res.status(200).json({ coffee: coffee?.data() })
  }

  public async destroy(req: Request, res: Response) {
    const { id } = req.params

    await CoffeeService.destroy(id)

    return res.status(204).end()
  }
}

export default new CoffeeController
