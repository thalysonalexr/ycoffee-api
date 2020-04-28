import { Types } from 'mongoose'

import { IFilter } from '@core/repository/IPaginate'

export function isValidObjectId(id: any) {
  try {
    return new Types.ObjectId(id).equals(id)
  } catch(err) {
    return false
  }
}

export function generateObjectFilters<T extends object>(...filters: IFilter<T>[]) {
  const merged = {}

  filters.forEach(filter => {
    const key = Object.keys(filter)[0]
    if (key)
      Object.assign(merged, { [key]: filter[key].toString() })
  })

  return merged
}

export function transformFieldsInRegex<T extends object>(data: T) {
  type KeyRegex = { [key: string]: { $regex: RegExp } }
  let filters: KeyRegex = {};

  (Object.keys(data) as Array<keyof typeof data>).forEach(field => {
    if (!isValidObjectId(data[field])) {
      filters[(field as string)] = { $regex: new RegExp(`.*${data[field]}.*`, 'i') }
      delete data[field]
    }
  })

  return { ...filters, ...data }
}
