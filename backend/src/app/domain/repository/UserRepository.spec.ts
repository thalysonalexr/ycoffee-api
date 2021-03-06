import faker from 'faker'

import factory from '@utils/test/factories'
import MongoMock from '@utils/test/MongoMock'

import { UserEntity } from '@domain/entity/UserEntity'
import { UserRepository } from '@domain/repository/UserRepository'
import User, { UserModel } from '@domain/schemas/User'

import { ObjectID } from '@domain/values/Mongo'
import { Name, Email, Password, Role } from '@domain/values/User'

const repository = new UserRepository(User)

process.env.UPLOAD_PATH = 'tests'

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
    const user = await repository.storeUser(
      UserEntity.create(
        faker.name.findName(),
        faker.internet.email(),
        faker.internet.password(6)
      )
    )

    expect(user).toStrictEqual(
      expect.objectContaining({
        id: expect.any(ObjectID),
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
    const admin = await repository.storeUser(
      UserEntity.createAdmin(
        faker.name.findName(),
        faker.internet.email(),
        faker.internet.password(6)
      )
    )

    expect(admin).toStrictEqual(
      expect.objectContaining({
        id: expect.any(ObjectID),
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
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const user = await repository.findByEmail(
      new Email(email)
    )

    expect(user).toStrictEqual(
      expect.objectContaining({
        id: expect.any(ObjectID),
        name: expect.any(Name),
        email: expect.any(Email),
        password: expect.any(Password),
        role: expect.any(Role),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })

  it('should be able get user by id', async () => {
    const { id } = await factory.create<UserModel>('User', {
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const user = await repository.findById(new ObjectID(id))

    expect(user).toStrictEqual(
      expect.objectContaining({
        id: expect.any(ObjectID),
        name: expect.any(Name),
        email: expect.any(Email),
        password: expect.any(Password),
        role: expect.any(Role),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })

  it('should be able update user by id', async () => {
    const { id } = await factory.create<UserModel>('User', {
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const user = await repository.updateUser(
      new ObjectID(id),
      UserEntity.create(
        faker.name.findName(),
        faker.internet.email(),
        faker.internet.password(6)
      )
    )

    expect(user).toStrictEqual(
      expect.objectContaining({
        id: expect.any(ObjectID),
        name: expect.any(Name),
        email: expect.any(Email),
        password: expect.any(Password),
        role: expect.any(Role),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    )
  })

  it('should be able remove user by id', async () => {
    const { id } = await factory.create<UserModel>('User', {
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const result = await repository.deleteUser(new ObjectID(id))

    expect(result).toBe(true)
  })
})
