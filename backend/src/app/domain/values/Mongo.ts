import { isValidObjectId } from 'mongoose'

import { IValueObject } from '@core/values/IValueObject'

export class ObjectID implements IValueObject {
  private _value: string

  constructor(value: string) {
    if (!isValidObjectId(value)) {
      throw new Error(`The id ${value} is invalid objectId Mongo.`)
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
