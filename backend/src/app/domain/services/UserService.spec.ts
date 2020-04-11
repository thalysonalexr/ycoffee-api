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
    const user = await UserService.register(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(6)
    )

    process.env.SECRET = 'secret@key'

    const token = UserService.generateUserToken(user.id)
    expect(token).toStrictEqual(expect.any(String))
    expect(token.split('.').length).toBe(3)
  })
})
