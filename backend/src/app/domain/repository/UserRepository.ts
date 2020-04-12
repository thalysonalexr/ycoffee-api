import { Model } from 'mongoose'

import User, { UserModel } from '@domain/schemas/User'

import { Email, ObjectID } from '@domain/values/User'
import { IValueObject } from '@core/values/IValueObject'
import { IUserEntity, UserEntity } from '@domain/entity/UserEntity'

export interface IUserRepository<T, K> {
  storeUser(user: T): Promise<T>
  findByEmail(email: K): Promise<T | null>
  findById(id: K): Promise<T | null>
  updateUser(id: K, user: T): Promise<T | null>
  deleteUser(id: K): Promise<boolean>
}

export class UserRepository implements IUserRepository<IUserEntity, IValueObject> {
  public constructor(private _instance: Model<UserModel>) {}

  public async storeUser(user: IUserEntity) {
    const data = await this._instance.create({
      name: user.name.toString(),
      email: user.email.toString(),
      password: user.password.toString(),
      role: 'user',
    })

    return UserRepository.fromNativeData(data)
  }

  public async findByEmail(email: Email): Promise<IUserEntity | null> {
    const user = await this._instance.findOne({
      email: email.toString()
    })

    if (user)
      return UserRepository.fromNativeData(user)

    return null
  }

  public async findById(id: ObjectID): Promise<IUserEntity | null> {
    const user = await this._instance.findById(
      id.toString()
    )

    if (user)
      return UserRepository.fromNativeData(user)

    return null
  }

  public async updateUser(id: ObjectID, u: IUserEntity): Promise<IUserEntity | null> {
    const user = await this._instance.findByIdAndUpdate(
      id.toString(),
      {
        name: u.name.toString(),
        email: u.email.toString(),
        password: u.password.toString(),
      },
      { new: true }
    )

    if (user)
      return UserRepository.fromNativeData(user)

    return null
  }

  public async deleteUser(id: ObjectID): Promise<boolean> {
    if (await this._instance.findByIdAndRemove(id.toString())) {
      return Promise.resolve(true)
    }

    return Promise.resolve(false)
  }

  private static fromNativeData(user: UserModel) {
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

export default new UserRepository(User)
