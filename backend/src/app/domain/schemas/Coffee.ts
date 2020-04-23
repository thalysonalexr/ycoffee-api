import mongoosePaginate from 'mongoose-paginate'
import mongoose, { Document, Schema, Query } from 'mongoose'
import path from 'path'
import fs from 'fs'

import { ICoffee } from '@core/schemas/ICoffee'

export type CoffeeModel = Document & ICoffee

async function destroyImage(schema: Query<any>) {
  const { _id } = schema.getQuery()

  const coffee = await schema.findOne({ _id })

  if (!coffee)
    return

  const { image: { key } } = coffee

  if (key !== undefined)
    fs.unlink(
      path.resolve(
        __dirname, '..', '..', '..', '..', 'tmp', process.env.UPLOAD_PATH, key
      ),
      () => {}
    )
}

const CoffeeSchema = new Schema<CoffeeModel>({
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

CoffeeSchema.plugin(mongoosePaginate)

CoffeeSchema.pre('findOneAndUpdate', async function() {
  await destroyImage(this)
})

CoffeeSchema.pre('findOneAndRemove', async function() {
  await destroyImage(this)
})

export default mongoose.model<CoffeeModel>('Coffee', CoffeeSchema)
