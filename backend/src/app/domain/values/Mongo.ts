import { isValidObjectId } from '@domain/repository/utils'

import { IValueObject } from '@core/values/IValueObject'

export class MongoValueException extends Error {
  constructor(message: string) {
    super(message)
    this.name = MongoValueException.name
  }

  public static new(message: string) {
    return new MongoValueException(message)
  }
}

export class ObjectID implements IValueObject {
  private _value: string

  constructor(value: string) {
    if (!isValidObjectId(value)) {
      throw MongoValueException.new(`The id ${value} is invalid objectId Mongo.`)
    }
    this._value = value
  }

  public toString(): string {
    return this._value
  }

  public static toObjectID(value: string) {
    return new ObjectID(value)
  }
}
