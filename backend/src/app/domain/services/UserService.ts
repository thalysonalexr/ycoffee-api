import { generateTokenJwt } from '@app/utils'

import { Email, ObjectID } from '@domain/values/User'
import { IValueObject } from '@core/values/IValueObject'
import { IUserEntity, UserEntity } from '@domain/entity/UserEntity'
import { IUserRepository, UserRepository } from '@app/domain/repository/UserRepository'

class UserService {
  public constructor(
    private _repository: IUserRepository<IUserEntity, IValueObject>
  ) {}

  public async register(
    name: string,
    email: string,
    password: string,
    role: 'user' | 'admin' = 'user'
  ) {
    if (role === 'user')
      return await this._repository.storeUser(
        UserEntity.create(name, email, password)
      )
    else
      return await this._repository.storeUser(
        UserEntity.createAdmin(name, email, password)
      )
  }

  public async getByEmail(email: string) {
    return await this._repository.findByEmail(new Email(email))
  }

  public async getById(id: string) {
    return await this._repository.findById(new ObjectID(id))
  }

  public generateUserToken(id: object | undefined) {
    return generateTokenJwt(process.env.SECRET, { id })
  }
}

export default new UserService(new UserRepository())
