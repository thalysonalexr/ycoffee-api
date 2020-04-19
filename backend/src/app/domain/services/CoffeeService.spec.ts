import faker from 'faker'

import factory from '@utils/test/factories'
import MongoMock from '@utils/test/MongoMock'

import User, { UserModel } from '@domain/schemas/User'
import Coffee, { CoffeeModel } from '@domain/schemas/Coffee'
import { CoffeeEntity } from '@domain/entity/CoffeeEntity'

import CoffeeService from '@domain/services/CoffeeService'

describe('Service Coffee', () => {
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

    const coffee = await CoffeeService.create({
      type: faker.name.title(),
      description: faker.lorem.words(5),
      ingredients: [faker.name.title(), faker.name.title()],
      preparation: faker.lorem.paragraphs(),
      timePrepare: faker.random.number(10),
      portions: faker.random.number(5),
      picture: faker.internet.url(),
      author: id
    })

    expect(coffee).toBeInstanceOf(CoffeeEntity)
  })

  it('should be able get coffee by id', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    const coffee = await CoffeeService.getById(id)

    expect(coffee).toBeInstanceOf(CoffeeEntity)
  })

  it('should be able get all cafes by type', async () => {
    const coffeeType = 'Americano'

    const user = await factory.create<UserModel>('User')

    await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    await factory.create<CoffeeModel>('Coffee', {
      type: coffeeType,
      author: user.id
    })

    await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    const cafes = await CoffeeService.getAllByType(1, coffeeType)

    expect(cafes).toStrictEqual(
      expect.objectContaining({
        cafes: expect.arrayContaining([
          expect.any(Object)
        ]),
        pages: expect.any(Number),
        total: expect.any(Number),
      })
    )
  })

  it('should be able get all cafes by author', async () => {
    const user1 = await factory.create<UserModel>('User', { email: 'hello@email.com' })
    const user2 = await factory.create<UserModel>('User', { email: 'world@email.com' })

    await factory.create<CoffeeModel>('Coffee', {
      author: user1.id
    })

    await factory.create<CoffeeModel>('Coffee', {
      author: user1.id
    })

    await factory.create<CoffeeModel>('Coffee', {
      author: user2.id
    })

    const cafes = await CoffeeService.getAllByAuthor(1, user1.id)

    expect(cafes).toStrictEqual(
      expect.objectContaining({
        cafes: expect.arrayContaining([
          expect.any(Object),
          expect.any(Object),
        ]),
        pages: expect.any(Number),
        total: expect.any(Number),
      })
    )
  })

  it('should be able update coffee by id', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    const coffee = await CoffeeService.update(id, {
      type: faker.name.title(),
      description: faker.lorem.words(5),
      ingredients: [faker.name.title(), faker.name.title()],
      preparation: faker.lorem.paragraphs(),
      timePrepare: faker.random.number(10),
      portions: faker.random.number(5),
      picture: faker.internet.url(),
      author: id
    })

    expect(coffee).toBeInstanceOf(CoffeeEntity)
  })

  it('should be able destroy coffee by id', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    const result = await CoffeeService.destroy(id)

    expect(result).toBe(true)
  })
})
