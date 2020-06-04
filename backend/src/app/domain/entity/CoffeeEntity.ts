import { IEntity } from '@core/entity/IEntity'
import { ObjectID } from '@domain/values/Mongo'
import { IUserEntity, UserEntity } from '@domain/entity/UserEntity'
import { ImageType } from '@domain/values/utils'
import {
  TypeCoffe,
  Description,
  Ingredients,
  Preparation,
  TimePrepare,
  Portions,
  Image,
} from '@domain/values/Coffee'

import { filterObjectFields } from '@domain/entity/utils'

export interface ICoffee {
  type: TypeCoffe
  description: Description
  ingredients: Ingredients
  preparation: Preparation
  timePrepare: TimePrepare
  portions: Portions
  image?: Image
  id?: ObjectID
  updatedAt?: Date
  createdAt?: Date
  author?: IUserEntity | ObjectID
}

type ICoffeeIndexes = keyof ICoffee

export interface ICoffeeEntity extends ICoffee, IEntity<ICoffeeIndexes> {
  appendImage(image: ImageType): CoffeeEntity
}

export class CoffeeEntity implements ICoffeeEntity {
  public constructor(
    public type: TypeCoffe,
    public description: Description,
    public ingredients: Ingredients,
    public preparation: Preparation,
    public timePrepare: TimePrepare,
    public portions: Portions,
    public image?: Image,
    public id?: ObjectID,
    public updatedAt?: Date,
    public createdAt?: Date,
    public author?: IUserEntity | ObjectID,
  ) {}

  public static create(
    type: string,
    description: string,
    ingredients: string[],
    preparation: string,
    timePrepare: number,
    portions: number,
    author: string,
  ): ICoffeeEntity {
    return new CoffeeEntity(
      TypeCoffe.toType(type),
      Description.toDescription(description),
      Ingredients.toIngredients(ingredients),
      Preparation.toPreparation(preparation),
      TimePrepare.toTimePrepare(timePrepare),
      Portions.toPortions(portions),
    ).appendAuthor(ObjectID.toObjectID(author))
  }

  public appendImage(image: ImageType) {
    this.image = Image.toImage(image)
    return this
  }

  public appendAuthor(author: IUserEntity | ObjectID) {
    this.author = author
    return this
  }

  public static fromNativeData(
    type: string,
    description: string,
    ingredients: string[],
    preparation: string,
    timePrepare: number,
    portions: number,
    image?: object,
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
      Image.toImage((image as ImageType)),
      ObjectID.toObjectID((id as string)),
      updatedAt,
      createdAt
    )
  }

  public static fromNativeDataWithAuthor(
    type: string,
    description: string,
    ingredients: string[],
    preparation: string,
    timePrepare: number,
    portions: number,
    authorName: string,
    authorEmail: string,
    authorPassword: string,
    authorId?: string,
    authorRole?: string,
    authorAvatar?: object,
    authorCreatedAt?: Date,
    authorUpdatedAt?: Date,
    image?: object,
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
      Image.toImage((image as ImageType)),
      ObjectID.toObjectID((id as string)),
      updatedAt,
      createdAt,
      UserEntity.fromNativeData(
        authorName,
        authorEmail,
        authorPassword,
        authorId,
        authorRole,
        authorAvatar,
        authorCreatedAt,
        authorUpdatedAt,
      ),
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
      image: this.image?.toObject(),
      updatedAt: this.updatedAt,
      createdAt: this.updatedAt,
      author: this.author && this.author instanceof UserEntity
        ? this.author.data(
            'email',
            'password',
            'role',
            'createdAt',
            'updatedAt'
          )
        : this.author && this.author.toString(),
    }, ...exclude)
  }
}
