import faker from 'faker'

import { generateObjectFilters } from '@domain/repository/utils'
import { IValueObject } from '@core/values/IValueObject'

import { Name, Email } from '@domain/values/User'

test('should be able create object with filters params', () => {
  const name = faker.name.findName()
  const email = faker.internet.email().toLowerCase()
  
  const filterName = { name: Name.toName(name) }
  const filterEmail = { email: Email.toEmail(email) }

  const objFiltered = generateObjectFilters<IValueObject>(filterName, filterEmail)

  expect(objFiltered).toStrictEqual(
    expect.objectContaining({
      name,
      email
    })
  )
})
