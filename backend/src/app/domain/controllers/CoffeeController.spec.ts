import faker from 'faker'
import request from 'supertest'
import path from 'path'
import fs from 'fs'

import app from '../../../app'

import { generateTokenJwt } from '@app/utils'

import factory from '@utils/test/factories'
import MongoMock from '@utils/test/MongoMock'

import User, { UserModel } from '@domain/schemas/User'
import Coffee, { CoffeeModel } from '@domain/schemas/Coffee'

const dirUploads = path.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'tests')
const dirExamples = path.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'tests', 'examples')

describe('Coffee actions', () => {
  beforeAll(async () => {
    await MongoMock.connect()
  })

  afterAll(async () => {
    await MongoMock.disconnect()
    // remove all images in upload test
    fs.readdir(dirUploads, (err, files) => {
      for (const file of files) {
        fs.unlink(path.join(dirUploads, file), () => {})
      }
    })
  })

  beforeEach(async () => {
    await User.deleteMany({})
    await Coffee.deleteMany({})
  })

  it('should be able create new coffee', async () => {
    const user = await factory.create<UserModel>('User')

    const token = generateTokenJwt(process.env.SECRET, { id: user.id })

    const coffee = {
      type: faker.name.title(),
      description: faker.lorem.words(10),
      ingredients: [faker.name.title(), faker.name.title()],
      preparation: faker.lorem.paragraphs(),
      timePrepare: faker.random.number(10),
      portions: faker.random.number(5),
    }

    const response = await request(app)
      .post('/v1/coffee')
      .set('Authorization', `Bearer ${token}`)
      .send(coffee)

    expect(response.status).toBe(201)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        coffee: expect.objectContaining({
          id: expect.any(String),
          type: expect.any(String),
          description: expect.any(String),
          ingredients: expect.any(Array),
          preparation: expect.any(String),
          timePrepare: expect.any(Number),
          portions: expect.any(Number),
          author: expect.any(Object),
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        })
      })
    )
  })

  it('should be able show coffee by id', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    const response = await request(app)
      .get(`/v1/coffee/${id}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        coffee: expect.objectContaining({
          id: expect.any(String),
          type: expect.any(String),
          description: expect.any(String),
          ingredients: expect.any(Array),
          preparation: expect.any(String),
          timePrepare: expect.any(Number),
          portions: expect.any(Number),
          author: expect.any(Object),
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        })
      })
    )
  })

  it('should be not able show coffee by id because not exists', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    await Coffee.deleteMany({})

    const response = await request(app)
      .get(`/v1/coffee/${id}`)

    expect(response.status).toBe(404)
  })

  it('should be not able show coffee by id because not exists', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', {
      author: user.id
    })

    await Coffee.deleteMany({})

    const response = await request(app)
      .get(`/v1/coffee/${id}`)

    expect(response.status).toBe(404)
  })

  it('should be able get all coffee by author to profile', async () => {
    const user = await factory.create<UserModel>('User')

    await factory.create<CoffeeModel>('Coffee', { author: user.id })
    await factory.create<CoffeeModel>('Coffee', { author: user.id })

    const token = generateTokenJwt(process.env.SECRET, { id: user.id })

    const response = await request(app)
      .get(`/v1/coffee/me`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        cafes: expect.arrayContaining([
          expect.any(Object),
          expect.any(Object),
        ]),
        pages: expect.any(Number),
        total: expect.any(Number),
      })
    )
  })

  it('should be able get all coffee filter type', async () => {
    const user = await factory.create<UserModel>('User')

    const filter = 'Expresso'

    await factory.create<CoffeeModel>('Coffee', { author: user.id })
    await factory.create<CoffeeModel>('Coffee', {
      type: filter,
      author: user.id
    })

    const response = await request(app)
      .get(`/v1/coffee?type=${filter}`)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        cafes: expect.arrayContaining([
          expect.any(Object),
          expect.any(Object),
        ]),
        pages: expect.any(Number),
        total: expect.any(Number),
      })
    )
  })

  it('should be able get all coffee', async () => {
    const user = await factory.create<UserModel>('User')

    await factory.create<CoffeeModel>('Coffee', { author: user.id })
    await factory.create<CoffeeModel>('Coffee', { author: user.id })

    const response = await request(app)
      .get('/v1/coffee')

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        cafes: expect.arrayContaining([
          expect.any(Object),
          expect.any(Object),
        ]),
        pages: expect.any(Number),
        total: expect.any(Number),
      })
    )
  })

  it('should be able update coffee', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', { author: user.id })
    const token = generateTokenJwt(process.env.SECRET, { id: user.id })

    const coffee = {
      type: faker.name.title(),
      description: faker.lorem.words(10),
      ingredients: [faker.name.title(), faker.name.title()],
      preparation: faker.lorem.paragraphs(),
      timePrepare: faker.random.number(10),
      portions: faker.random.number(5),
    }

    const response = await request(app)
      .put(`/v1/coffee/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(coffee)

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        coffee: expect.objectContaining({
          id: expect.any(String),
          type: expect.any(String),
          description: expect.any(String),
          ingredients: expect.any(Array),
          preparation: expect.any(String),
          timePrepare: expect.any(Number),
          portions: expect.any(Number),
          author: expect.any(Object),
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        })
      })
    )
  })

  it('should be not able update coffee because not exists', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', { author: user.id })
    const token = generateTokenJwt(process.env.SECRET, { id: user.id })

    await Coffee.deleteMany({})

    const response = await request(app)
      .put(`/v1/coffee/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: faker.name.title(),
        description: faker.lorem.words(10),
        ingredients: [faker.name.title(), faker.name.title()],
        preparation: faker.lorem.paragraphs(),
        timePrepare: faker.random.number(10),
        portions: faker.random.number(5),
      })

    expect(response.status).toBe(404)
  })

  it('should be able destroy coffee', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', { author: user.id })
    const token = generateTokenJwt(process.env.SECRET, { id: user.id })

    const response = await request(app)
      .delete(`/v1/coffee/${id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should be not able destroy coffee because not exists', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', { author: user.id })
    const token = generateTokenJwt(process.env.SECRET, { id: user.id })

    await Coffee.deleteMany({})

    const response = await request(app)
      .delete(`/v1/coffee/${id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
  })

  it('should be not able append image because unsupported media type', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', { author: user.id })
    const token = generateTokenJwt(process.env.SECRET, { id: user.id })

    const response = await request(app)
      .put(`/v1/coffee/${id}/image`)
      .attach('image', path.resolve(dirExamples, 'example.pdf'))
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(415)
  })

  it('should be not able append image because exceeds allowed size', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', { author: user.id })
    const token = generateTokenJwt(process.env.SECRET, { id: user.id })

    const response = await request(app)
      .put(`/v1/coffee/${id}/image`)
      .attach('image', path.resolve(dirExamples, 'full.jpg'))
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(413)
  })

  it('should be not able append image because coffee not exists', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', { author: user.id })
    const token = generateTokenJwt(process.env.SECRET, { id: user.id })

    await Coffee.deleteMany({})

    const response = await request(app)
      .put(`/v1/coffee/${id}/image`)
      .attach('image', path.resolve(dirExamples, 'example.jpg'))
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
  })

  it('should be able append image in coffee', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', { author: user.id })
    const token = generateTokenJwt(process.env.SECRET, { id: user.id })

    const response = await request(app)
      .put(`/v1/coffee/${id}/image`)
      .attach('image', path.resolve(dirExamples, 'example.jpg'))
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it('should be able destroy coffee with image', async () => {
    const user = await factory.create<UserModel>('User')

    const { id } = await factory.create<CoffeeModel>('Coffee', { author: user.id })
    const token = generateTokenJwt(process.env.SECRET, { id: user.id })

    await request(app)
      .put(`/v1/coffee/${id}/image`)
      .attach('image', path.resolve(dirExamples, 'example.jpg'))
      .set('Authorization', `Bearer ${token}`)

    const response = await request(app)
      .delete(`/v1/coffee/${id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })
})
