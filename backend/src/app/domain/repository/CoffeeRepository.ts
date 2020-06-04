import { PaginateModel } from 'mongoose'

import { generateObjectFilters, transformFieldsInRegex } from '@domain/repository/utils'

import { IValueObject } from '@core/values/IValueObject'
import { IFilter, IPaginate } from '@core/repository/IPaginate'

import { ObjectID } from '@domain/values/Mongo'
import Coffee, { CoffeeModel } from '@domain/schemas/Coffee'
import { ICoffeeEntity, CoffeeEntity } from '@domain/entity/CoffeeEntity'

export interface ICoffeeRepository<T, K> {
  storeCoffee(coffee: T): Promise<T>
  findById(id: K): Promise<T | null>
  findAll(page: number, limit: number, ...filters: IFilter<K>[]): Promise<IPaginate<T>>
  updateCoffee(id: K, coffee: T): Promise<T | null>
  deleteCoffee(id: K): Promise<boolean>
}

export class CoffeeRepository implements ICoffeeRepository<ICoffeeEntity, IValueObject> {
  public constructor(private _instance: PaginateModel<CoffeeModel>) {}

  public async storeCoffee(coffee: ICoffeeEntity): Promise<ICoffeeEntity> {
    const data = await this._instance.create({
      type: coffee.type.toString(),
      description: coffee.description.toString(),
      ingredients: coffee.ingredients.toArray(),
      preparation: coffee.preparation.toString(),
      timePrepare: coffee.timePrepare.toNumber(),
      portions: coffee.portions.toNumber(),
      author: coffee.author && coffee.author.toString(),
    })

    return CoffeeRepository.fromNativeData(
      await data.populate('author').execPopulate()
    )
  }

  public async findById(id: ObjectID): Promise<ICoffeeEntity | null> {
    const coffee = await this._instance.findById(id.toString()).populate('author')

    if (coffee)
      return CoffeeRepository.fromNativeData(coffee)

    return null
  }

  public async findAll(page: number, limit: number, ...filters: IFilter<IValueObject>[]): Promise<IPaginate<ICoffeeEntity>> {
    const merged = generateObjectFilters<IValueObject>(...filters)
  
    const { docs, pages, total } = await this._instance.paginate(
      transformFieldsInRegex(merged), { page, limit }
    )

    const coffees = await Promise.all(docs.map(
      async coffee => {
        return CoffeeRepository.fromNativeData(
          await coffee.populate('author').execPopulate()
        )
    }))

    return { docs: coffees, pages, total }
  }

  public async updateCoffee(id: ObjectID, c: ICoffeeEntity): Promise<ICoffeeEntity | null> {
    const coffee = await this._instance.findByIdAndUpdate(
      id.toString(), c.data('id', 'author', 'updatedAt', 'createdAt'),
      { new: true }
    )

    if (coffee) {
      return CoffeeRepository.fromNativeData(
        await coffee.populate('author').execPopulate()
      )
    }

    return null
  }

  public async deleteCoffee(id: ObjectID): Promise<boolean> {
    if (await this._instance.findByIdAndRemove(id.toString())) {
      return Promise.resolve(true)
    }

    return Promise.resolve(false)
  }

  private static fromNativeData(coffee: CoffeeModel) {
    if (null === coffee.author) {
      return CoffeeEntity.fromNativeData(
        coffee.type,
        coffee.description,
        coffee.ingredients,
        coffee.preparation,
        coffee.timePrepare,
        coffee.portions,
        coffee.image,
        coffee.id,
        coffee.updatedAt,
        coffee.createdAt,
      )
    }

    return CoffeeEntity.fromNativeDataWithAuthor(
      coffee.type,
      coffee.description,
      coffee.ingredients,
      coffee.preparation,
      coffee.timePrepare,
      coffee.portions,
      coffee.author.name,
      coffee.author.email,
      coffee.author.password,
      String(coffee.author._id),
      coffee.author.role,
      coffee.author.avatar,
      coffee.author.createdAt,
      coffee.author.updatedAt,
      coffee.image,
      coffee.id,
      coffee.updatedAt,
      coffee.createdAt
    )
  }
}

export default new CoffeeRepository(Coffee)
