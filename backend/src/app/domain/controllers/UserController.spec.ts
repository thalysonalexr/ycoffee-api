import faker from 'faker'
import request from 'supertest'

import app from '../../../app'

import User, { UserModel } from '@domain/schemas/User'
import MongoMock from '@utils/test/MongoMock'
import factory from '@utils/test/factories'
import { Password } from '../values/User'

describe('Users actions', () => {
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
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(6),
    }

    const response = await request(app)
      .post('/v1/users')
      .send(user)

    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: expect.any(String),
          name: user.name,
          email: user.email,
          role: 'user',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      })
    )
  })

  it('should be not able register because user already exists', async () => {
    const pass = faker.internet.password(6)
    const user = await factory.create<UserModel>('User', {
      password: Password.toPassword(pass).hash().toString()
    })

    const response = await request(app)
      .post('/v1/users')
      .send({
        name: user.email,
        email: user.email,
        password: pass,
      })

    expect(response.status).toBe(422)
    expect(response.body).toStrictEqual({ error: 'User already exists.' })
  })

  it('should be not able register user with wrong content', async () => {
    const response = await request(app)
      .post('/v1/users')
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(3), // invalid
      })

    expect(response.status).toBe(400)
  })
})