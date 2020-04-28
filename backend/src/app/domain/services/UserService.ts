import { generateTokenJwt } from '@app/utils'

import { IValueObject } from '@core/values/IValueObject'

import { ObjectID } from '@domain/values/Mongo'
import { ImageType } from '@domain/values/utils'
import { Email, RoleType } from '@domain/values/User'
import { IUserEntity, UserEntity } from '@domain/entity/UserEntity'
import UserRepository, { IUserRepository } from '@domain/repository/UserRepository'

type UserData = {
  name: string,
  email: string,
  password: string,
  role: RoleType
}

export class UserService {
  public constructor(private _repository: IUserRepository<IUserEntity, IValueObject>) {}

  public async register(user: UserData) {
    return user.role === 'user'
      ? await this._repository.storeUser(
          UserEntity.create(user.name, user.email, user.password)
        )
      : await this._repository.storeUser(
          UserEntity.createAdmin(user.name, user.email, user.password)
        )
  }

  public async appendAvatar(id: string, avatar: ImageType) {
    const user = await this._repository.findById(id)

    if (!user)
      return null

    return await this._repository.updateUser(
      ObjectID.toObjectID(id),
      user.appendAvatar(avatar)
    )
  }

  public async getByEmail(email: string) {
    return await this._repository.findByEmail(Email.toEmail(email))
  }

  public async getById(id: string) {
    return await this._repository.findById(ObjectID.toObjectID(id))
  }

  public async update(id: string, user: UserData) {
    const userEntity = user.role === 'user'
      ? UserEntity.create(user.name, user.email, user.password)
      : UserEntity.createAdmin(user.name, user.email, user.password)
    
    return await this._repository.updateUser(
      ObjectID.toObjectID(id),
      userEntity
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
