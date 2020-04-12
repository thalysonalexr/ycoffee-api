import { ObjectID, Name, Email, Password, Role, RoleType } from '@domain/values/User'

export interface IUser {
  name: Name,
  email: Email,
  password: Password,
  role?: Role,
  id?: ObjectID,
  createdAt?: Date,
  updatedAt?: Date,
}

export interface IUserEntity extends IUser {
  data(exclude: string[]): any
}

export class UserEntity implements IUserEntity {
  public constructor(
    public name: Name,
    public email: Email,
    public password: Password,
    public role?: Role,
    public id?: ObjectID,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  public static create(name: string, email: string, password: string): UserEntity {
    return new UserEntity(
      Name.toName(name),
      Email.toEmail(email),
      Password.toPassword(password).hash(),
      Role.toRole('user')
    )
  }

  public static createAdmin(name: string, email: string, password: string): UserEntity {
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
    createdAt?: Date,
    updatedAt?: Date,
  ): UserEntity {
    return new UserEntity(
      Name.toName(name),
      Email.toEmail(email),
      Password.toPassword(password),
      Role.toRole((role as RoleType)),
      ObjectID.toObjectID((id as string)),
      createdAt,
      updatedAt,
    )
  }

  public data(exclude: string[]) {
    const data = {
      id: this.id?.toString(),
      name: this.name.toString(),
      email: this.email.toString(),
      password: this.password.toString(),
      role: this.role?.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    const filtered = (Object.keys(data) as Array<keyof typeof data>).filter(
      (field: keyof IUser) => {
      if (exclude.includes(field)) {
        delete data[field]
      }
    })

    return { data, filtered }
  }
}
