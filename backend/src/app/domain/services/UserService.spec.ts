import faker from 'faker'

import MongoMock from '@utils/test/MongoMock'
import factory from '@utils/test/factories'

import User, { UserModel } from '@domain/schemas/User'
import { UserEntity } from '@domain/entity/UserEntity'
import UserService from '@domain/services/UserService'

process.env.SECRET = 'secret@key'

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

  it('should be not able append avatar because user not exists', async () => {
    const { id } = await factory.create<UserModel>('User')

    await User.deleteMany({})

    const result = await UserService.appendAvatar(id, {
      name: faker.random.alphaNumeric(16),
      key: faker.random.alphaNumeric(16),
      size: faker.random.number(5000),
    })

    expect(result).toBe(null)
  })

  it('should be able append new avatar in user', async () => {
    const { id } = await factory.create<UserModel>('User')

    const result = await UserService.appendAvatar(id, {
      name: faker.random.alphaNumeric(16),
      key: faker.random.alphaNumeric(16),
      size: faker.random.number(5000),
    })

    expect(result).toBeInstanceOf(UserEntity)
  })
})
