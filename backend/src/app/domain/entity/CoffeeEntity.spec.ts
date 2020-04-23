import faker from 'faker'

import { UserEntity } from '@domain/entity/UserEntity'
import { CoffeeEntity } from '@domain/entity/CoffeeEntity'

import {
  TypeCoffe,
  Description,
  Ingredients,
  Preparation,
  TimePrepare,
  Portions,
} from '@domain/values/Coffee';
import { Name, Email, Password, Role } from '@domain/values/User'

describe('Coffee Entity', () => {
  it('should be able create new instance Coffee entity', () => {
    const user = new UserEntity(
      new Name(faker.name.findName()),
      new Email(faker.internet.email()),
      new Password(faker.internet.password(6)),
      new Role('user'),
    )

    const coffee = new CoffeeEntity(
      new TypeCoffe(faker.name.title()),
      new Description(faker.lorem.words(10)),
      new Ingredients([faker.name.title(), faker.name.title()]),
      new Preparation(faker.lorem.paragraphs()),
      new TimePrepare(faker.random.number(10)),
      new Portions(faker.random.number(10)),
      user
    )

    expect(coffee.type).toBeInstanceOf(TypeCoffe)
    expect(coffee.description).toBeInstanceOf(Description)
    expect(coffee.ingredients).toBeInstanceOf(Ingredients)
    expect(coffee.preparation).toBeInstanceOf(Preparation)
    expect(coffee.timePrepare).toBeInstanceOf(TimePrepare)
    expect(coffee.portions).toBeInstanceOf(Portions)
    expect(coffee.author).toBeInstanceOf(UserEntity)
  })

  it('should be able create new instance user and get data', () => {
    const user = new UserEntity(
      new Name(faker.name.findName()),
      new Email(faker.internet.email()),
      new Password(faker.internet.password(6)),
      new Role('user'),
    )

    const coffee = new CoffeeEntity(
      new TypeCoffe(faker.name.title()),
      new Description(faker.lorem.words(10)),
      new Ingredients([faker.name.title(), faker.name.title()]),
      new Preparation(faker.lorem.paragraphs()),
      new TimePrepare(faker.random.number(10)),
      new Portions(faker.random.number(10)),
      user
    ).data('author')

    expect(coffee).toStrictEqual(expect.any(Object))
  })

  it('should be able append image in coffee', () => {
    const user = new UserEntity(
      new Name(faker.name.findName()),
      new Email(faker.internet.email()),
      new Password(faker.internet.password(6)),
      new Role('user'),
    )

    const coffee = new CoffeeEntity(
      new TypeCoffe(faker.name.title()),
      new Description(faker.lorem.words(10)),
      new Ingredients([faker.name.title(), faker.name.title()]),
      new Preparation(faker.lorem.paragraphs()),
      new TimePrepare(faker.random.number(10)),
      new Portions(faker.random.number(10)),
      user
    )

    const image = {
      name: faker.random.alphaNumeric(16),
      key: faker.random.alphaNumeric(16),
      size: faker.random.number(5000)
    }

    coffee.appendImage({
      name: image.name,
      key: image.key,
      size: image.size,
    })

    expect(coffee.image?.toObject()).toStrictEqual(
      expect.objectContaining({
        name: image.name,
        key: image.key,
        size: image.size
      })
    )
  })
})
