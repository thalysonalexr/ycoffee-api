import faker from 'faker'

import MongoMock from '@utils/test/MongoMock'

import User from '@domain/schemas/User'
import { UserEntity } from '@domain/entity/UserEntity'
import UserService from '@domain/services/UserService'

describe('Service User', () => {
  beforeAll(async () => {
    await MongoMock.connect()
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  it('should be able register new user', async () => {
    const user = await UserService.register({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
      role: 'user'
    })

    expect(user).toBeInstanceOf(UserEntity)
  })

  it('should be able register new admin', async () => {
    const user = await UserService.register({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
      role: 'admin'
    })

    expect(user).toBeInstanceOf(UserEntity)
  })

  it('should be generate user token', async () => {
    const { id } = await UserService.register({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
      role: 'user'
    })

    process.env.SECRET = 'secret@key'

    const token = UserService.generateUserToken({ id })
    expect(token).toStrictEqual(expect.any(String))
    expect(token.split('.').length).toBe(3)
  })

  it('should be able update user', async () => {
    const { id } = await UserService.register({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
      role: 'user'
    })

    const user = await UserService.update(<string>id?.toString(), {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
      role: 'user'
    })

    expect(user).toBeInstanceOf(UserEntity)
  })

  it('should be able remove user', async () => {
    const { id } = await UserService.register({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
      role: 'user'
    })

    const result = await UserService.remove(<string>id?.toString())

    expect(result).toBe(true)
  })

  it('should be able update role', async () => {
    const { id } = await UserService.register({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
      role: 'user'
    })

    const result = await UserService.updateRole(<string>id?.toString(), 'disabled')

    expect(result).toStrictEqual(true)
  })
})
