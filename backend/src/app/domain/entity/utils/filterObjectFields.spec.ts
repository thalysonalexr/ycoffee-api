import faker from 'faker'

import { filterObjectFields } from '@domain/entity/utils'

test('should be able filter undefined and exclude properties in object', () => {
  const obj = {
    id: undefined,
    name: faker.name.findName(),
    email: faker.internet.email(),
    url: faker.internet.url(),
    obj: {}
  }

  const result = filterObjectFields(obj, 'url')

  expect(result).toStrictEqual(
    expect.objectContaining({
      name: obj.name,
      email: obj.email
    })
  )
})
