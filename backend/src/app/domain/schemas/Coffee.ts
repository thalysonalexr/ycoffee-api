import mongoosePaginate from 'mongoose-paginate'
import mongoose, { Document, Schema } from 'mongoose'

import { ICoffee } from '@core/schemas/ICoffee'

export type CoffeeModel = Document & ICoffee

const CoffeeSchema = new Schema({
  type: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 45,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 255,
  },
  ingredients: [{
    type: String,
    maxlength: 45,
    required: true
  }],
  preparation: {
    type: String,
    minlength: 45,
    required: true,
    trim: true,
  },
  timePrepare: {
    type: Number,
    required: false,
  },
  portions: {
    type: Number,
    required: false,
  },
  picture: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
}, { timestamps: true })

CoffeeSchema.plugin(mongoosePaginate)

export default mongoose.model<CoffeeModel>('Coffee', CoffeeSchema)
