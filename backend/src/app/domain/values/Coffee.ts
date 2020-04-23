import { IValueObject } from '@core/values/IValueObject'

export type ImageType = {
  name: string,
  key: string,
  size: number,
}

export class CoffeeValueException extends Error {
  constructor(message: string) {
    super(message)
    this.name = CoffeeValueException.name
  }

  public static new(message: string) {
    return new CoffeeValueException(message)
  }
}

export class TypeCoffe implements IValueObject {
  private _value: string

  public constructor(value: string) {
    if (value.length < 1 || value.length > 45) {
      throw CoffeeValueException.new(`The type "${value}" of coffee must be 1 to 45 characters`)
    }

    this._value = value
  }

  public toString() {
    return this._value
  }

  public static toType(value: string) {
    return new TypeCoffe(value)
  }
}

export class Description implements IValueObject {
  private _value: string

  public constructor(value: string) {
    if (value.length < 20 || value.length > 255) {
      throw CoffeeValueException.new(`The description "${value}" of coffee must be 20 to 255 characters`)
    }

    this._value = value
  }

  public toString() {
    return this._value
  }

  public static toDescription(value: string) {
    return new Description(value)
  }
}

export class Ingredients implements IValueObject {
  private _value: string[]

  public constructor(value: string[]) {
    this._value = value
  }

  public add(ingredient: string) {
    if (ingredient.length > 45) {
      throw CoffeeValueException.new(`Ingredient "${ingredient}" must be length 45 or less`)
    }

    this._value.push(ingredient)
    return this
  }

  public toArray() {
    return this._value
  }

  public static toIngredients(value: string[] = []) {
    return new Ingredients(value)
  }
}

export class Preparation implements IValueObject {
  private _value: string

  public constructor(value: string) {
    if (value.length < 45) {
      throw CoffeeValueException.new(`The "${value}" must be length 45 or more`)
    }

    this._value = value
  }

  public toString() {
    return this._value
  }

  public static toPreparation(value: string) {
    return new Preparation(value)
  }
}

export class TimePrepare implements IValueObject {
  private _value: number
  private readonly flag: string = 'Minute(s)'

  public constructor(value: number) {
    if (value < 0) {
      throw CoffeeValueException.new('Negative numbers are invalid')
    }

    this._value = value
  }

  public toFormatted(): string {
    return `${this._value < 10 ? '0' + this._value : this._value} ${this.flag}`
  }

  public toNumber() {
    return this._value
  }

  public static toTimePrepare(value: number) {
    return new TimePrepare(value)
  }
}

export class Portions implements IValueObject {
  private _value: number

  public constructor(value: number) {
    if (value < 0) {
      throw CoffeeValueException.new('Negative numbers are invalid')
    }

    this._value = value
  }

  public toNumber() {
    return this._value
  }

  public static toPortions(value: number) {
    return new Portions(value)
  }
}

export class Image implements IValueObject {
  private _value: ImageType

  public constructor(value: ImageType) {
    this._value = value
  }

  public toObject() {
    return this._value
  }

  public static toImage(value: ImageType) {
    return new Image(value)
  }
}
