import mongoose, { Document, Schema } from 'mongoose'

import { IUser } from '@core/schemas/IUser'
import { destroyImage } from '@config/multer'

export type UserModel = Document & IUser

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'disabled'],
    default: 'user'
  },
  avatar: {
    name: {
      type: String,
      trim: true,
    },
    key: {
      type: String,
      trim: true,
    },
    size: Number,
  }
}, { timestamps: true })

UserSchema.pre('findOneAndUpdate', async function(next) {
  const { _id } = this.getQuery()
  const user = await this.findOne({ _id })

  if (!user) return next()

  const update = this.getUpdate()

  if (user.avatar.key && update.avatar && user.avatar.key !== update.avatar.key)
    await destroyImage(user.avatar.key)

  return next()
})

UserSchema.pre('findOneAndRemove', async function(next) {
  const { _id } = this.getQuery()
  const user = await this.findOne({ _id })

  if (user && user.avatar.key)
    await destroyImage(user.avatar.key)

  return next()
})

export default mongoose.model<UserModel>('User', UserSchema)
