import mongoose, { Document, Schema } from 'mongoose'

import { IUser } from '@app/core/schemas/IUser'

export type UserModel = Document & IUser;

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
}, { timestamps: true })

export default mongoose.model<UserModel>('User', UserSchema)
