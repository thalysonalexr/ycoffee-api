import { Request, Response } from 'express'
import { destroyImage } from '@config/multer'

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
    } = req.body

    const coffee = await CoffeeService.create({
      type,
      description,
      ingredients,
      preparation,
      timePrepare,
      portions,
      author
    })

    return res.status(201).json({ coffee: coffee.data() })
  }

  public async storeImage(req: Request, res: Response) {
    const { id } = req.params
    const { id: author } = req.session
    const { originalname: name, filename: key, size } = req.file

    const coffee = await CoffeeService.appendImageByAuthor(id, author, {
      name,
      key,
      size
    })

    if (!coffee) {
      await destroyImage(key)
      return res.status(404).json({ error: 'Coffee not found.' })
    }

    return res.json({ coffee: coffee.data() })
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

    const coffees = await CoffeeService.getAllByAuthor((page as number), id)

    return res.status(200).json(coffees)
  }

  public async index(req: Request, res: Response) {
    const { page = 1, type, preparation } = req.query

    if (!type && !preparation)
      return res.status(200).json(
        await CoffeeService.getAllBy((page as number))
      )

    if (preparation)
      return res.status(200).json(
        await CoffeeService.getAllByPreparation((page as number), preparation as string)
      )
    else
      return res.status(200).json(
        await CoffeeService.getAllByType((page as number), (type as string))
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
    } = req.body

    const coffee = await CoffeeService.updateByAuthor(id, {
      type,
      description,
      ingredients,
      preparation,
      timePrepare,
      portions,
      author
    })

    if (!coffee)
      return res.status(404).json({ error: 'Coffee not found.' })

    return res.status(200).json({ coffee: coffee.data() })
  }

  public async destroy(req: Request, res: Response) {
    const { id } = req.params
    const { id: author } = req.session

    if (null === await CoffeeService.destroyByAuthor(id, author))
      return res.status(404).json({ error: 'Coffee not found.' })

    return res.status(204).end()
  }
}

export default new CoffeeController
