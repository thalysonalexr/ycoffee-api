import { IUser } from '@core/schemas/IUser'

export interface ICoffee {
  _id: object
  type: string
  description: string
  ingredients: string[]
  preparation: string
  timePrepare: number
  portions: number
  picture: string
  author: object & IUser
  updatedAt: Date
  createdAt: Date
}
