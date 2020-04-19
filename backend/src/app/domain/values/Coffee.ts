import { IValueObject } from '@core/values/IValueObject'

export class TypeCoffe implements IValueObject {
  private _value: string

  public constructor(value: string) {
    if (value.length < 1 || value.length > 45) {
      throw new Error(`The type "${value}" of coffee must be 1 to 45 characters`)
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
      throw new Error(`The description "${value}" of coffee must be 20 to 255 characters`)
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
      throw new Error(`Ingredient "${ingredient}" must be length 45 or less`)
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
      throw new Error(`The "${value}" must be length 45 or more`)
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
      throw new Error('Negative numbers are invalid')
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
      throw new Error('Negative numbers are invalid')
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

export class Picture implements IValueObject {
  private _value: string
  private readonly mask = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i')

  public constructor(value: string) {
    if(!this.mask.test(value)) {
      throw new Error(`The value "${value}" is not valid URL`)
    }

    this._value = value
  }

  public toString() {
    return this._value
  }

  public static toPicture(value: string) {
    return new Picture(value)
  }
}
