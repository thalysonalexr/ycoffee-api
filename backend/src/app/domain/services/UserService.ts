import { generateTokenJwt } from '@app/utils'

import { ObjectID } from '@domain/values/Mongo'
import { Email, RoleType } from '@domain/values/User'
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
    role: RoleType = 'user'
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

  public async updateRole(id: string, role: RoleType) {
    const user = await this._repository.findById(ObjectID.toObjectID(id))

    if (user) {
      await this._repository.updateUser(
        ObjectID.toObjectID(id),
        user.toRole(role)
      )
      return Promise.resolve(true)
    }

    return Promise.resolve(false)
  }

  public generateUserToken(payload: object) {
    return generateTokenJwt(process.env.SECRET, payload)
  }
}

export default new UserService(UserRepository)
