import request from 'supertest'

import '@config/index'
import app from '../../../app'
import User, { UserModel } from '@domain/schemas/User'
import factory from '@utils/test/factories'
import MongoMock from '@utils/test/MongoMock'

import { Password } from '@domain/values/User'
import { generateTokenJwt } from '@app/utils'

describe('Session', () => {
  beforeAll(async () => {
    await MongoMock.connect()
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  it('should be able create new session', async () => {
    const pass = '123456'
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

  it('should be not create user with email not registered', async () => {
    const response = await request(app)
      .post('/v1/session')
      .send({
        email: 'thalyson@email.com',
        password: '123456'
      })

    expect(response.status).toBe(401)
    expect(response.body).toStrictEqual({ error: 'User not exists.' })
  })

  it('should be able access private route', async () => {    
    const { id } = await factory.create<UserModel>('User', {
      password: Password.toPassword('123456').hash().toString()
    })

    const token = generateTokenJwt(process.env.SECRET, { id })

    const response = await request(app)
      .get('/v1')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it('should be not able access private route without token', async () => {
    const response = await request(app)
      .get('/v1')

    expect(response.status).toBe(401)
  })

  it('should be not able access private route with token without flag bearer', async () => {
    const response = await request(app)
      .get('/v1')
      .set('Authorization', 'djj123n1j322j198c87c8qwycqwcqw7qw6')

    expect(response.status).toBe(401)
  })

  it('should be not able access private route with wrong bearer flag', async () => {
    const response = await request(app)
      .get('/v1')
      .set('Authorization', 'bear dqwidnin1in32n3i1i12in312n3i12')

    expect(response.status).toBe(401)
  })

  it('should be bot able acess private route with invalid token', async () => {
    const response = await request(app)
      .get('/v1')
      .set('Authorization', 'Bearer 312312idn12idi12ndinid12id12i')
    
    expect(response.status).toBe(401)
  })
})
