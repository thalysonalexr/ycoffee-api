import faker from 'faker'

import User, { UserModel } from '@domain/schemas/User'
import factory from '@utils/test/factories'
import MongoMock from '@utils/test/MongoMock'

import { UserEntity } from '@domain/entity/UserEntity'
import { UserRepository } from '@domain/repository/UserRepository'
import { Name, Email, Password, Role } from '@domain/values/User'

const repository = new UserRepository

describe('User Repository', () => {
  beforeAll(async () => {
    await MongoMock.connect()
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  it('should be able create new user', async () => {
    const user = await repository.createNewUser(
      UserEntity.create(
        faker.name.findName(),
        faker.internet.email(),
        faker.internet.password(6)
      )
    )

    expect(user).toStrictEqual(
      expect.objectContaining({
        id: expect.any(Object),
        name: expect.any(Name),
        email: expect.any(Email),
        password: expect.any(Password),
        role: expect.any(Role),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })

  it('should be able create new admin', async () => {
    const admin = await repository.createNewAdmin(
      UserEntity.createAdmin(
        faker.name.findName(),
        faker.internet.email(),
        faker.internet.password(6)
      )
    )

    expect(admin).toStrictEqual(
      expect.objectContaining({
        id: expect.any(Object),
        name: expect.any(Name),
        email: expect.any(Email),
        password: expect.any(Password),
        role: expect.any(Role),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })

  it('should be able get user by email', async () => {
    const { email } = await factory.create<UserModel>('User', {
      password: Password.toPassword('12345').hash().toString()
    })

    const user = await repository.getUserByEmail(
      new Email(email)
    )

    expect(user).toStrictEqual(
      expect.objectContaining({
        id: expect.any(Object),
        name: expect.any(Name),
        email: expect.any(Email),
        password: expect.any(Password),
        role: expect.any(Role),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })
})
