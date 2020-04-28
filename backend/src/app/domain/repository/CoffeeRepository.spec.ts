import faker from 'faker'

import factory from '@utils/test/factories'
import MongoMock from '@utils/test/MongoMock'

import { UserEntity } from '@domain/entity/UserEntity'
import { CoffeeEntity } from '@domain/entity/CoffeeEntity'
import { CoffeeRepository } from '@domain/repository/CoffeeRepository'

import User, { UserModel } from '@domain/schemas/User'
import Coffee, { CoffeeModel } from '@domain/schemas/Coffee'

import { ObjectID } from '@domain/values/Mongo'
import {
  TypeCoffe,
  Description,
  Preparation,
  Ingredients,
  TimePrepare,
  Portions
} from '@domain/values/Coffee'

const repository = new CoffeeRepository(Coffee)

process.env.UPLOAD_PATH = 'tests'

describe('Coffee Repository', () => {
  beforeAll(async () => {
    await MongoMock.connect()
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  beforeEach(async () => {
    await User.deleteMany({})
    await Coffee.deleteMany({})
  })

  it('should be able create new coffee', async () => {
    const { id } = await factory.create<UserModel>('User')

    const coffee = await repository.storeCoffee(
      CoffeeEntity.create(
        faker.name.title(),
        faker.lorem.words(10),
        [faker.name.title(), faker.name.title()],
        faker.lorem.paragraphs(),
        faker.random.number(10),
        faker.random.number(5),
        id
      )
    )

    expect(coffee).toStrictEqual(
      expect.objectContaining({
        id: expect.any(ObjectID),
        type: expect.any(TypeCoffe),
        description: expect.any(Description),
        ingredients: expect.any(Ingredients),
        preparation: expect.any(Preparation),
        timePrepare: expect.any(TimePrepare),
        portions: expect.any(Portions),
        author: expect.any(UserEntity),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })

  it('should be able get coffe by id', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    const coffee = await repository.findById(id)

    expect(coffee).toStrictEqual(
      expect.objectContaining({
        id: expect.any(ObjectID),
        type: expect.any(TypeCoffe),
        description: expect.any(Description),
        ingredients: expect.any(Ingredients),
        preparation: expect.any(Preparation),
        timePrepare: expect.any(TimePrepare),
        portions: expect.any(Portions),
        author: expect.any(UserEntity),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })

  it('should be able find all coffees', async () => {
    const user = await factory.create<UserModel>('User')

    await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    const coffees = await repository.findAll(1, 5)

    expect(coffees.docs.length).toBe(3)
  })

  it('should be able update coffee by id', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    const coffee = await repository.updateCoffee(
      ObjectID.toObjectID(id),
      CoffeeEntity.create(
        faker.name.title(),
        faker.lorem.words(10),
        [faker.name.title(), faker.name.title()],
        faker.lorem.paragraphs(),
        faker.random.number(10),
        faker.random.number(5),
        user.id
      )
    )

    expect(coffee).toStrictEqual(
      expect.objectContaining({
        id: expect.any(ObjectID),
        type: expect.any(TypeCoffe),
        description: expect.any(Description),
        ingredients: expect.any(Ingredients),
        preparation: expect.any(Preparation),
        timePrepare: expect.any(TimePrepare),
        portions: expect.any(Portions),
        author: expect.any(UserEntity),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })

  it('should be not able update coffee because not exists', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    await Coffee.deleteMany({})

    const coffee = await repository.updateCoffee(
      ObjectID.toObjectID(id),
      CoffeeEntity.create(
        faker.name.title(),
        faker.lorem.words(10),
        [faker.name.title(), faker.name.title()],
        faker.lorem.paragraphs(),
        faker.random.number(10),
        faker.random.number(5),
        user.id
      )
    )

    expect(coffee).toBe(null)
  })

  it('should be able destroy a coffee', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    const result = await repository.deleteCoffee(id)

    expect(result).toBe(true)
  })
})
