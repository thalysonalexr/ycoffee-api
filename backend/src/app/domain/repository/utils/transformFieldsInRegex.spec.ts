import faker from 'faker'

import { transformFieldsInRegex } from '@domain/repository/utils'

test('transform fields to search with ilike operator', () => {
  const type = faker.name.findName()
  const email = faker.internet.email()

  const result = transformFieldsInRegex({ type, email })

  expect(result).toStrictEqual({
    type: expect.any(Object),
    email: expect.any(Object),
  })
})
