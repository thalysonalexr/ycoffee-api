import { generateTokenJwt } from '@app/utils'

import { Email } from '@domain/values/User'
import { IValueObject } from '@core/values/IValueObject'
import { IUserEntity, UserEntity } from '@domain/entity/UserEntity'
import { IUserRepository, UserRepository } from '@app/domain/repository/UserRepository'

class UserService {
  public constructor(
    private _repository: IUserRepository<IUserEntity, IValueObject>
  ) {}

  public async register(name: string, email: string, password: string, role: string = 'user') {
    if (role === 'user') {
      return await this._repository.createNewUser(UserEntity.create(name, email, password))
    }

    return await this._repository.createNewAdmin(UserEntity.createAdmin(name, email, password))
  }

  public async getByEmail(email: string) {
    return await this._repository.getUserByEmail(new Email(email))
  }

  public generateUserToken(id: object | undefined) {
    return generateTokenJwt(process.env.SECRET, { id })
  }
}

export default new UserService(new UserRepository())
