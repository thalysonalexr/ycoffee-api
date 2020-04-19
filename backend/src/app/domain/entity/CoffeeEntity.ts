import { IEntity } from '@core/entity/IEntity'
import { ObjectID } from '@domain/values/Mongo'
import { IUserEntity, UserEntity } from '@domain/entity/UserEntity'
import {
  TypeCoffe,
  Description,
  Ingredients,
  Preparation,
  TimePrepare,
  Portions,
  Picture
} from '@domain/values/Coffee';

import { filterObjectFields } from '@app/utils'

export interface ICoffee {
  type: TypeCoffe
  description: Description
  ingredients: Ingredients
  preparation: Preparation
  timePrepare: TimePrepare
  portions: Portions
  picture: Picture
  author: IUserEntity | ObjectID
  id?: ObjectID
  updatedAt?: Date
  createdAt?: Date
}

type ICoffeeIndexes = keyof ICoffee

export interface ICoffeeEntity extends ICoffee, IEntity<ICoffeeIndexes> {}

export class CoffeeEntity implements ICoffeeEntity {
  public constructor(
    public type: TypeCoffe,
    public description: Description,
    public ingredients: Ingredients,
    public preparation: Preparation,
    public timePrepare: TimePrepare,
    public portions: Portions,
    public picture: Picture,
    public author: IUserEntity | ObjectID,
    public id?: ObjectID,
    public updatedAt?: Date,
    public createdAt?: Date
  ) {}

  public static create(
    type: string,
    description: string,
    ingredients: string[],
    preparation: string,
    timePrepare: number,
    portions: number,
    picture: string,
    author: string,
  ): ICoffeeEntity {
    return new CoffeeEntity(
      TypeCoffe.toType(type),
      Description.toDescription(description),
      Ingredients.toIngredients(ingredients),
      Preparation.toPreparation(preparation),
      TimePrepare.toTimePrepare(timePrepare),
      Portions.toPortions(portions),
      Picture.toPicture(picture),
      ObjectID.toObjectID(author)
    )
  }

  public static fromNativeData(
    type: string,
    description: string,
    ingredients: string[],
    preparation: string,
    timePrepare: number,
    portions: number,
    picture: string,
    authorName: string,
    authorEmail: string,
    authorPassword: string,
    authorId?: string,
    authorRole?: string,
    authorCreatedAt?: Date,
    authorUpdatedAt?: Date,
    id?: string,
    updatedAt?: Date,
    createdAt?: Date
  ): ICoffeeEntity {
    return new CoffeeEntity(
      TypeCoffe.toType(type),
      Description.toDescription(description),
      Ingredients.toIngredients(ingredients),
      Preparation.toPreparation(preparation),
      TimePrepare.toTimePrepare(timePrepare),
      Portions.toPortions(portions),
      Picture.toPicture(picture),
      UserEntity.fromNativeData(
        authorName,
        authorEmail,
        authorPassword,
        authorId,
        authorRole,
        authorCreatedAt,
        authorUpdatedAt,
      ),
      ObjectID.toObjectID((id as string)),
      updatedAt,
      createdAt
    )
  }

  public data(...exclude: ICoffeeIndexes[]) {
    return filterObjectFields({
      id: this.id?.toString(),
      type: this.type.toString(),
      description: this.description.toString(),
      ingredients: this.ingredients.toArray(),
      preparation: this.preparation.toString(),
      timePrepare: this.timePrepare.toNumber(),
      portions: this.portions.toNumber(),
      picture: this.picture.toString(),
      author: this.author instanceof UserEntity
        ? this.author.data(
            'email',
            'password',
            'role',
            'createdAt',
            'updatedAt'
          )
        : this.author.toString(),
      updatedAt: this.updatedAt,
      createdAt: this.updatedAt
    }, ...exclude)
  }
}
