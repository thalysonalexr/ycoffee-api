import { IUser } from '@core/schemas/IUser'

export interface ICoffee {
  _id: object
  type: string
  description: string
  ingredients: string[]
  preparation: string
  timePrepare: number
  portions: number
  image: {
    name: string,
    key: string,
    size: number
  }
  author: object & IUser
  updatedAt: Date
  createdAt: Date
}
