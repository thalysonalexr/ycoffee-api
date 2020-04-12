import { generateTokenJwt } from '@app/utils'

import { Email, ObjectID } from '@domain/values/User'
import { IValueObject } from '@core/values/IValueObject'
import { IUserEntity, UserEntity } from '@domain/entity/UserEntity'
import UserRepository, { IUserRepository } from '@app/domain/repository/UserRepository'

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
    return await this._repository.findByEmail(Email.toEmail(email))
  }

  public async getById(id: string) {
    return await this._repository.findById(ObjectID.toObjectID(id))
  }

  public async update(id: string, name: string, email: string, password: string) {
    return await this._repository.updateUser(
      ObjectID.toObjectID(id),
      UserEntity.create(name, email, password)
    )
  }

  public async remove(id: string) {
    return await this._repository.deleteUser(ObjectID.toObjectID(id))
  }

  public generateUserToken(id: object | undefined) {
    return generateTokenJwt(process.env.SECRET, { id })
  }
}

export default new UserService(UserRepository)
