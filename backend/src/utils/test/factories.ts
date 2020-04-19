import faker from 'faker'
import factory from 'factory-girl'

import User from '@domain/schemas/User'
import Coffee from '@domain/schemas/Coffee'

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(6),
})

factory.define('Admin', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: 'admin'
})

factory.define('Coffee', Coffee, {
  type: faker.name.title(),
  description: faker.lorem.words(10),
  ingredients: [faker.name.title(), faker.name.title()],
  preparation: faker.lorem.paragraphs(),
  timePrepare: faker.random.number(10),
  portions: faker.random.number(5),
  picture: faker.internet.url(),
  author: faker.random.alphaNumeric(12)
})

export default factory
