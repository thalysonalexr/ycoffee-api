import bcrypt from 'bcryptjs'

import { IValueObject } from '@core/values/IValueObject'

import { ImageType } from '@domain/values/utils'

export type RoleType = 'admin' | 'disabled' | 'user'

export class UserValueException extends Error {
  constructor(message: string) {
    super(message)
    this.name = UserValueException.name
  }

  public static new(message: string) {
    return new UserValueException(message)
  }
}

export class Name implements IValueObject {
  private _value: string

  constructor(value: string) {
    if (value.length < 3 || value.length > 255) {
      throw UserValueException.new(`The name ${value} is invalid`)
    }
    this._value = value
  }

  public toString(): string {
    return this._value
  }

  public static toName(value: string) {
    return new Name(value)
  }
}

export class Email implements IValueObject {
  private _value: string
  private readonly mask: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  constructor(value: string) {
    if (!this.mask.test(String(value).toLowerCase())) {
      throw UserValueException.new(`The e-mail "${value}" format is invalid.`)
    }
    this._value = value.toLowerCase()
  }

  public toString(): string {
    return this._value
  }

  public static toEmail(value: string) {
    return new Email(value)
  }
}

export class Password implements IValueObject {
  private _value: string

  constructor(value: string) {
    if (value.length < 5 || value.length > 255) {
      throw UserValueException.new(`The password "${value}" is invalid.`)
    }
    this._value = value
  }

  public hash() {
    this._value = bcrypt.hashSync(this._value, 10)
    return this
  }

  public compare(password: string): boolean {
    return bcrypt.compareSync(password, this._value)
  }

  public toString(): string {
    return this._value
  }

  public static toPassword(value: string) {
    return new Password(value)
  }
}

export class Role implements IValueObject {
  private _value: string

  constructor(role: RoleType) {
    this._value = role
  }

  public toString(): string {
    return this._value
  }

  public static toRole(value: RoleType) {
    return new Role(value)
  }
}

export class Avatar implements IValueObject {
  private _value: ImageType

  constructor(value: ImageType) {
    this._value = value
  }

  public toObject() {
    return this._value
  }

  public static toAvatar(value: ImageType) {
    return new Avatar(value)
  }
}
