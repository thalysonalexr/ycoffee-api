import faker from 'faker'

import { Types } from 'mongoose'

import { ObjectID, MongoValueException } from '@domain/values/Mongo'

describe('Unit test to value objects Mongo', () => {
  it('should be able create new valid objectID', () => {
    const objectId = String(Types.ObjectId())
    expect(new ObjectID(objectId).toString()).toBe(objectId)
  })

  it('should be able create invalid objectID', () => {
    const objectId = faker.name.findName().substring(0, 2)
    try {
      expect(new ObjectID(objectId)).toThrow(MongoValueException)
    } catch (err) {}
  })
})
