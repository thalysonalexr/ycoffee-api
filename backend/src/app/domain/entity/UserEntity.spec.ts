import { Name, Email, Password, Role } from '@domain/values/User'
import { UserEntity } from '@domain/entity/UserEntity'

describe('User Entity', () => {
  it('should be able create new instance user entity', () => {
    const user = new UserEntity(
      new Name('Thalyson Rodrigues'),
      new Email('thalysonrodrigues.dev@gmail.com'),
      new Password('123456'),
      new Role('user'),
    )

    expect(user.name).toBeInstanceOf(Name)
    expect(user.email).toBeInstanceOf(Email)
    expect(user.password).toBeInstanceOf(Password)
    expect(user.role).toBeInstanceOf(Role)
  })
})
