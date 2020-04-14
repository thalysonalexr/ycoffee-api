import faker from 'faker'

import User from '@domain/schemas/User'
import MongoMock from '@utils/test/MongoMock'

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
    const user = await UserService.register(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(6)
    )

    expect(user).toStrictEqual(expect.any(Object))
  })

  it('should be able register new admin', async () => {
    const user = await UserService.register(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(6),
      'admin'
    )

    expect(user).toStrictEqual(expect.any(Object))
  })

  it('should be generate user token', async () => {
    const { id } = await UserService.register(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(6)
    )

    process.env.SECRET = 'secret@key'

    const token = UserService.generateUserToken({ id })
    expect(token).toStrictEqual(expect.any(String))
    expect(token.split('.').length).toBe(3)
  })

  it('should be able update user', async () => {
    const { id } = await UserService.register(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(6)
    )

    const user = await UserService.update(
      <string>id?.toString(),
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(6),
    )

    expect(user).toStrictEqual(expect.any(Object))
  })

  it('should be able remove user', async () => {
    const { id } = await UserService.register(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(6)
    )

    const result = await UserService.remove(<string>id?.toString())

    expect(result).toBe(true)
  })

  it('should be able update role', async () => {
    const { id } = await UserService.register(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(6)
    )

    const result = await UserService.updateRole(<string>id?.toString(), 'disabled')

    expect(result).toStrictEqual(true)
  })
})
