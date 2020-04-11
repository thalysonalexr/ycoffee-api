import faker from 'faker'

import { Name, Email, Password, Role } from '@domain/values/User'
import { UserEntity } from '@domain/entity/UserEntity'

describe('User Entity', () => {
  it('should be able create new instance user entity complete', () => {
    const user = new UserEntity(
      new Name(faker.name.findName()),
      new Email(faker.internet.email()),
      new Password(faker.internet.password(6)),
      new Role('user'),
    )

    expect(user.name).toBeInstanceOf(Name)
    expect(user.email).toBeInstanceOf(Email)
    expect(user.password).toBeInstanceOf(Password)
    expect(user.role).toBeInstanceOf(Role)
  })

  it('should be able create new instance user entity less role', () => {
    const user = new UserEntity(
      new Name(faker.name.findName()),
      new Email(faker.internet.email()),
      new Password(faker.internet.password(6)),
    )

    expect(user.name).toBeInstanceOf(Name)
    expect(user.email).toBeInstanceOf(Email)
    expect(user.password).toBeInstanceOf(Password)
  })

  it('should be able create new instance user and get data', () => {
    const user = new UserEntity(
      new Name(faker.name.findName()),
      new Email(faker.internet.email()),
      new Password(faker.internet.password(6)),
      new Role('user'),
    ).data([])

    expect(user).toStrictEqual(
      expect.objectContaining({
        data: expect.any(Object),
        filtered: expect.arrayContaining([])
      })
    )
  })

  it('should be able create new instance user less role and get data', () => {
    const user = new UserEntity(
      new Name(faker.name.findName()),
      new Email(faker.internet.email()),
      new Password(faker.internet.password(6)),
    ).data([])

    expect(user).toStrictEqual(
      expect.objectContaining({
        data: expect.any(Object),
        filtered: expect.arrayContaining([])
      })
    )
  })
})
