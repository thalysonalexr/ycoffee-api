import mongoosePaginate from 'mongoose-paginate'
import mongoose, { Document, Schema } from 'mongoose'

import { ICoffee } from '@core/schemas/ICoffee'

import { destroyImage } from '@config/multer'

export type CoffeeModel = Document & ICoffee

const CoffeeSchema = new Schema({
  type: {
    type: String,
    required: true,
    trim: true,
    maxlength: 45,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  ingredients: [{
    type: String,
    maxlength: 45,
    required: true
  }],
  preparation: {
    type: String,
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
  image: {
    name: {
      type: String,
      trim: true,
    },
    key: {
      type: String,
      trim: true,
    },
    size: Number,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { timestamps: true })

CoffeeSchema.pre('findOneAndUpdate', async function(next) {
  const { _id } = this.getQuery()
  const coffee = await this.findOne({ _id })

  if (!coffee) return next()

  const update = this.getUpdate()

  if (coffee.image.key && update.image && coffee.image.key !== update.image.key)
    await destroyImage(coffee.image.key)

  return next()
})

CoffeeSchema.pre('findOneAndRemove', async function(next) {
  const { _id } = this.getQuery()
  const coffee = await this.findOne({ _id })

  if (coffee && coffee.image.key)
    await destroyImage(coffee.image.key)

  return next()
})

CoffeeSchema.plugin(mongoosePaginate)

export default mongoose.model<CoffeeModel>('Coffee', CoffeeSchema)
