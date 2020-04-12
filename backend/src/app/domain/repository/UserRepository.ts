import User, { UserModel } from '@domain/schemas/User'

import { Email, ObjectID } from '@domain/values/User'
import { IValueObject } from '@core/values/IValueObject'
import { IUserEntity, UserEntity } from '@domain/entity/UserEntity'

export interface IUserRepository<T, K> {
  storeUser(data: T): Promise<T>
  findByEmail(email: K): Promise<T | null>
  findById(id: K): Promise<T | null>
}

export class UserRepository implements IUserRepository<IUserEntity, IValueObject> {
  public async storeUser(user: IUserEntity) {
    const data = await User.create({
      name: user.name.toString(),
      email: user.email.toString(),
      password: user.password.toString(),
      role: 'user',
    })

    return this.fromNativeData(data)
  }

  public async findByEmail(email: Email): Promise<IUserEntity | null> {
    const user = await User.findOne({ email: email.toString() }).select('+password')

    if (user)
      return this.fromNativeData(user)

    return null
  }

  public async findById(id: ObjectID): Promise<IUserEntity | null> {
    const user = await User.findById(id.toString()).select('+password')

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
