import faker from 'faker'
import request from 'supertest'

import '@config/index'

import app from '../../../app'

import { generateTokenJwt } from '@app/utils'
import factory from '@utils/test/factories'
import MongoMock from '@utils/test/MongoMock'

import User, { UserModel } from '@domain/schemas/User'
import Coffee, { CoffeeModel } from '@domain/schemas/Coffee'

import { Password } from '@domain/values/User'

describe('Session', () => {
  beforeAll(async () => {
    await MongoMock.connect()
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  beforeEach(async () => {
    await Coffee.deleteMany({})
    await User.deleteMany({})
  })

  it('should be able create new session', async () => {
    const pass = faker.internet.password(6)
    const user = await factory.create<UserModel>('User', {
      password: Password.toPassword(pass).hash().toString()
    })

    const response = await request(app)
      .post('/v1/session')
      .send({
        email: user.email,
        password: pass
      })

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        user: expect.any(Object),
        token: expect.any(String)
      })
    )
  })
  
  it('should be not create user with wrong password', async () => {
    const user = await factory.create<UserModel>('User', {
      password: Password.toPassword('123456').hash().toString()
    })

    const response = await request(app)
      .post('/v1/session')
      .send({
        email: user.email,
        password: '123455'
      })

    expect(response.status).toBe(401)
    expect(response.body).toStrictEqual({ error: 'Wrong password.' })
  })

  it('should be not create session with email not registered', async () => {
    const response = await request(app)
      .post('/v1/session')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(6)
      })

    expect(response.status).toBe(401)
    expect(response.body).toStrictEqual({ error: 'User not exists.' })
  })

  it('should be able access private route', async () => {    
    const { id } = await factory.create<UserModel>('User')
    const { id: coffee } = await factory.create<CoffeeModel>('Coffee', {
      author: id
    })

    const token = generateTokenJwt(process.env.SECRET, { id })

    const response = await request(app)
      .delete(`/v1/coffee/${coffee}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should be not able access private route without token', async () => {
    const { id } = await factory.create<UserModel>('User')
    const { id: coffee } = await factory.create<CoffeeModel>('Coffee', {
      author: id
    })

    const response = await request(app).delete(`/v1/coffee/${coffee}`)

    expect(response.status).toBe(401)
  })

  it('should be not able access private route with token without flag bearer', async () => {
    const { id } = await factory.create<UserModel>('User')
    const { id: coffee } = await factory.create<CoffeeModel>('Coffee', {
      author: id
    })

    const response = await request(app)
      .delete(`/v1/coffee/${coffee}`)
      .set('Authorization', 'djj123n1j322j198c87c8qwycqwcqw7qw6')

    expect(response.status).toBe(401)
  })

  it('should be not able access private route with wrong bearer flag', async () => {
    const { id } = await factory.create<UserModel>('User')
    const { id: coffee } = await factory.create<CoffeeModel>('Coffee', {
      author: id
    })

    const response = await request(app)
      .delete(`/v1/coffee/${coffee}`)
      .set('Authorization', 'bear dqwidnin1in32n3i1i12in312n3i12')

    expect(response.status).toBe(401)
  })

  it('should be not able access private route with invalid token', async () => {
    const { id } = await factory.create<UserModel>('User')
    const { id: coffee } = await factory.create<CoffeeModel>('Coffee', {
      author: id
    })

    const response = await request(app)
      .delete(`/v1/coffee/${coffee}`)
      .set('Authorization', 'Bearer 312312idn12idi12ndinid12id12i')
    
    expect(response.status).toBe(401)
  })
})
