import { IEntity } from '@core/entity/IEntity'
import { ObjectID } from '@domain/values/Mongo'
import { Name, Email, Password, Role, Avatar, RoleType } from '@domain/values/User'
import { ImageType } from '@domain/values/utils'

import { filterObjectFields } from '@domain/entity/utils'

export interface IUser {
  name: Name
  email: Email
  password: Password
  role?: Role
  avatar?: Avatar
  id?: ObjectID
  createdAt?: Date
  updatedAt?: Date
}

type IUserIndexes = keyof IUser

export interface IUserEntity extends IUser, IEntity<IUserIndexes> {
  toRole(role: RoleType): UserEntity
  appendAvatar(avatar: ImageType): UserEntity
}

export class UserEntity implements IUserEntity {
  public constructor(
    public name: Name,
    public email: Email,
    public password: Password,
    public role?: Role,
    public avatar?: Avatar,
    public id?: ObjectID,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  public static create(name: string, email: string, password: string): IUserEntity {
    return new UserEntity(
      Name.toName(name),
      Email.toEmail(email),
      Password.toPassword(password).hash(),
      Role.toRole('user')
    )
  }

  public static createAdmin(name: string, email: string, password: string): IUserEntity {
    return new UserEntity(
      Name.toName(name),
      Email.toEmail(email),
      Password.toPassword(password).hash(),
      Role.toRole('admin')
    )
  }

  public static fromNativeData(
    name: string,
    email: string,
    password: string,
    id?: string,
    role?: string,
    avatar?: object,
    createdAt?: Date,
    updatedAt?: Date,
  ): IUserEntity {
    return new UserEntity(
      Name.toName(name),
      Email.toEmail(email),
      Password.toPassword(password),
      Role.toRole((role as RoleType)),
      Avatar.toAvatar((avatar as ImageType)),
      ObjectID.toObjectID((id as string)),
      createdAt,
      updatedAt,
    )
  }

  public toRole(role: RoleType): UserEntity {
    this.role = Role.toRole(role)
    return this
  }

  public appendAvatar(avatar: ImageType): UserEntity {
    this.avatar = Avatar.toAvatar(avatar)
    return this
  }

  public toString() {
    return (this.id as ObjectID).toString()
  }

  public data(...exclude: IUserIndexes[]) {
    return filterObjectFields({
      id: this.id?.toString(),
      name: this.name.toString(),
      email: this.email.toString(),
      password: this.password.toString(),
      role: this.role?.toString(),
      avatar: this.avatar?.toObject(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }, ...exclude)
  }
}
