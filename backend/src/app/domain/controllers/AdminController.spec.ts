import faker from 'faker'
import request from 'supertest'

import '@config/index'
import app from '../../../app'
import User, { UserModel } from '@domain/schemas/User'
import factory from '@utils/test/factories'
import MongoMock from '@utils/test/MongoMock'

import { Password } from '@domain/values/User'
import { generateTokenJwt } from '@app/utils'

describe('Admin actions', () => {
  beforeAll(async () => {
    await MongoMock.connect()
  })

  afterAll(async () => {
    await MongoMock.disconnect()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  it('should be not able disable user because user not exists', async () => {
    const user = await factory.create<UserModel>('Admin', {
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const token = generateTokenJwt(process.env.SECRET, {
      id: user.id,
      role: user.role
    })

    await User.deleteMany({})

    const response = await request(app)
      .post(`/v1/users/${user.id}/disable`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
  })

  it('should be able disable user', async () => {
    const user = await factory.create<UserModel>('Admin', {
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const token = generateTokenJwt(process.env.SECRET, {
      id: user.id,
      role: user.role
    })

    const response = await request(app)
      .post(`/v1/users/${user.id}/disable`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should be not able enable user because user not exists', async () => {
    const user = await factory.create<UserModel>('Admin', {
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const token = generateTokenJwt(process.env.SECRET, {
      id: user.id,
      role: user.role
    })

    await User.deleteMany({})

    const response = await request(app)
      .post(`/v1/users/${user.id}/enable`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
  })

  it('should be able enable user', async () => {
    const user = await factory.create<UserModel>('Admin', {
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const token = generateTokenJwt(process.env.SECRET, {
      id: user.id,
      role: user.role
    })

    const response = await request(app)
      .post(`/v1/users/${user.id}/enable`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should be not able disable user because not admin', async () => {
    const user = await factory.create<UserModel>('User', {
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const token = generateTokenJwt(process.env.SECRET, {
      id: user.id,
      role: user.role
    })

    const response = await request(app)
      .post(`/v1/users/${user.id}/disable`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(403)
  })

  it('should be able remove user by id', async () => {
    const admin = await factory.create<UserModel>('Admin', {
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const user = await factory.create<UserModel>('User', {
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const token = generateTokenJwt(process.env.SECRET, {
      id: admin.id,
      role: admin.role
    })

    const response = await request(app)
      .delete(`/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should be not able remove user by id because user not exists', async () => {
    const admin = await factory.create<UserModel>('Admin', {
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const user = await factory.create<UserModel>('User', {
      password: Password.toPassword(
        faker.internet.password(6)
      ).hash().toString()
    })

    const token = generateTokenJwt(process.env.SECRET, {
      id: admin.id,
      role: admin.role
    })

    await User.deleteMany({})

    const response = await request(app)
      .delete(`/v1/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
  })
})
