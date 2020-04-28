export interface IUser {
  _id: object
  name: string
  email: string
  password: string
  role: string
  avatar: {
    name: string
    key: string
    size: number
  },
  createdAt: Date
  updatedAt: Date
}
