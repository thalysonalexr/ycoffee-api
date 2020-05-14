import { IValueObject } from '@core/values/IValueObject'

import { ObjectID } from '@domain/values/Mongo'
import { ImageType } from '@domain/values/utils'
import { TypeCoffe, Preparation } from '@domain/values/Coffee'
import { ICoffeeEntity, CoffeeEntity } from '@domain/entity/CoffeeEntity'
import CoffeeRepository, { ICoffeeRepository } from '@domain/repository/CoffeeRepository'

type CoffeeData = {
  type: string,
  description: string,
  ingredients: string[],
  preparation: string,
  timePrepare: number,
  portions: number,
  author: string,
}

export class CoffeeService {
  public constructor(private _repository: ICoffeeRepository<ICoffeeEntity, IValueObject>) {}

  public async create(coffee: CoffeeData) {
    return await this._repository.storeCoffee(
      CoffeeEntity.create(
        coffee.type,
        coffee.description,
        coffee.ingredients,
        coffee.preparation,
        coffee.timePrepare,
        coffee.portions,
        coffee.author,
      )
    )
  }

  public async appendImageByAuthor(id: string, author: string, image: ImageType) {
    const coffee = await this._repository.findById(id)

    if (!coffee || coffee.author.toString() !== author)
      return null

    return await this._repository.updateCoffee(
      ObjectID.toObjectID(id),
      coffee.appendImage(image)
    )
  }

  public async getById(id: string) {
    return await this._repository.findById(ObjectID.toObjectID(id))
  }

  public async getAllByType(page: number, limit: number, type: string) {
    return this.getAllBy(page, limit, [
      { type: TypeCoffe.toType(type) }
    ])
  }

  public async getAllByAuthor(
    page: number, limit: number, id: string, params?: {
      type?: string,
      preparation?: string
    }) {

    if (params) {
      if (params.type)
        return this.getAllBy(page, limit, [
          { author: ObjectID.toObjectID(id), },
          { type: TypeCoffe.toType(params.type) },
        ])

      if (params.preparation)
        return this.getAllBy(page, limit, [
          { author: ObjectID.toObjectID(id) },
          { preparation: TypeCoffe.toType(params.preparation) },
        ])
    }

    return this.getAllBy(page, limit, [
      { author: ObjectID.toObjectID(id), }
    ])
  }

  public async getAllByPreparation(page: number, limit: number, preparation: string) {
    return this.getAllBy(page, limit, [
      { preparation: Preparation.toPreparation(preparation) }
    ])
  }

  public async getAllBy(page: number, limit: number, params: {}[] = []) {
    const { docs, pages, total } = await this._repository.findAll(
      page, limit, ...params
    )

    const coffees = await Promise.all(docs.map(coffee => coffee.data()))

    return { coffees, pages, total }
  }

  public async updateByAuthor(id: string, data: CoffeeData) {
    const coffee = await this._repository.findById(id)

    if (!coffee || coffee.author.toString() !== data.author)
      return null

    return await this._repository.updateCoffee(
      ObjectID.toObjectID(id),
      CoffeeEntity.create(
        data.type,
        data.description,
        data.ingredients,
        data.preparation,
        data.timePrepare,
        data.portions,
        data.author,
      )
    )
  }

  public async destroyByAuthor(id: string, author: string) {
    const coffee = await this._repository.findById(id)

    if (!coffee || coffee.author.toString() !== author)
      return null

    return await this.destroy(id)
  }

  public async destroy(id: string) {
    return await this._repository.deleteCoffee(ObjectID.toObjectID(id))
  }
}

export default new CoffeeService(CoffeeRepository)
