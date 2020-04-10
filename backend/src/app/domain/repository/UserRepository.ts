import User, { UserModel } from '@domain/schemas/User'

import { Email } from '@domain/values/User'
import { IValueObject } from '@core/values/IValueObject'
import { IUserEntity, UserEntity } from '@domain/entity/UserEntity'

export interface IUserRepository<T, K> {
  createNewUser(data: T): Promise<T>
  createNewAdmin(data: T): Promise<T>
  getUserByEmail(email: K): Promise<T | null>
}

export class UserRepository implements IUserRepository<IUserEntity, IValueObject> {
  public async createNewUser(user: IUserEntity) {
    const data = await User.create({
      name: user.name.toString(),
      email: user.email.toString(),
      password: user.password.toString(),
      role: 'user',
    })

    return this.fromNativeData(data)
  }

  public async createNewAdmin(user: IUserEntity) {
    const data = await User.create({
      name: user.name.toString(),
      email: user.email.toString(),
      password: user.password.toString(),
      role: (user.role as IValueObject).toString(),
    })

    return this.fromNativeData(data)
  }

  public async getUserByEmail(email: Email): Promise<IUserEntity | null> {
    const user = await User.findOne({ email: email.toString() }).select('+password')

    if (user)
      return this.fromNativeData(user)

    return null
  }

  private fromNativeData(user: UserModel) {
    return UserEntity.fromNativeData(
      user.name,
      user.email,
      user.password,
      user._id,
      user.role,
      user.createdAt,
      user.updatedAt,
    )
  }
}
