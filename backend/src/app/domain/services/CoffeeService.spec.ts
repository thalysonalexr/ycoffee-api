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
      type: faker.random.alphaNumeric(20),
      description: faker.lorem.words(5),
      ingredients: [faker.name.title(), faker.name.title()],
      preparation: faker.lorem.paragraphs(),
      timePrepare: faker.random.number(10),
      portions: faker.random.number(5),
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

  it('should be able get all coffees by type', async () => {
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

    const coffees = await CoffeeService.getAllByType(1, coffeeType)

    expect(coffees).toStrictEqual(
      expect.objectContaining({
        coffees: expect.arrayContaining([
          expect.any(Object)
        ]),
        pages: expect.any(Number),
        total: expect.any(Number),
      })
    )
  })

  it('should be able get all coffees by author', async () => {
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

    const coffees = await CoffeeService.getAllByAuthor(1, user1.id)

    expect(coffees).toStrictEqual(
      expect.objectContaining({
        coffees: expect.arrayContaining([
          expect.any(Object),
          expect.any(Object),
        ]),
        pages: expect.any(Number),
        total: expect.any(Number),
      })
    )
  })

  it('should be able get all coffees by preparation', async () => {
    const user1 = await factory.create<UserModel>('User', { email: 'hello@email.com' })
    const user2 = await factory.create<UserModel>('User', { email: 'world@email.com' })

    const sentence = 'hello'

    await factory.create<CoffeeModel>('Coffee', {
      author: user1.id,
      preparation: sentence
    })

    await factory.create<CoffeeModel>('Coffee', {
      author: user1.id
    })

    await factory.create<CoffeeModel>('Coffee', {
      author: user2.id
    })

    const coffees = await CoffeeService.getAllByPreparation(1, sentence)

    expect(coffees).toStrictEqual(
      expect.objectContaining({
        coffees: expect.arrayContaining([
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

    const coffee = await CoffeeService.updateByAuthor(id, {
      type: faker.name.title(),
      description: faker.lorem.words(5),
      ingredients: [faker.name.title(), faker.name.title()],
      preparation: faker.lorem.paragraphs(),
      timePrepare: faker.random.number(10),
      portions: faker.random.number(5),
      author: user.id
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

  it('should be not able append image because coffee not exists', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    await Coffee.deleteMany({})

    const result = await CoffeeService.appendImageByAuthor(id, user.id, {
      name: faker.random.alphaNumeric(16),
      key: faker.random.alphaNumeric(16),
      size: faker.random.number(5000),
    })

    expect(result).toBe(null)
  })

  it('should be not able append image because not owner', async () => {
    const user1 = await factory.create<UserModel>('User', { email: 'hello@email.com' })
    const user2 = await factory.create<UserModel>('User', { email: 'world@email.com' })

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user1.id
    })

    const result = await CoffeeService.appendImageByAuthor(id, user2.id, {
      name: faker.random.alphaNumeric(16),
      key: faker.random.alphaNumeric(16),
      size: faker.random.number(5000),
    })

    expect(result).toBe(null)
  })

  it('should be able append new image in coffee', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    const result = await CoffeeService.appendImageByAuthor(id, user.id, {
      name: faker.random.alphaNumeric(16),
      key: faker.random.alphaNumeric(16),
      size: faker.random.number(5000),
    })

    expect(result).toBeInstanceOf(CoffeeEntity)
  })
})
