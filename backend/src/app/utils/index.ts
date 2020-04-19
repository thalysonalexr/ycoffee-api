import jwt from 'jsonwebtoken';

import { IFilter } from '@app/core/repository/IPaginate'

export function generateTokenJwt(secretKey: string, payload = {}) {
  return jwt.sign(payload, secretKey, {
    expiresIn: 86400,
    algorithm: 'HS256',
  });
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

export function filterObjectFields<T extends object, K extends keyof T>(data: T, ...exclude: K[]) {
  (Object.keys(data) as Array<keyof typeof data>).forEach(field => {
    if (data[field] === undefined || exclude.includes((field as K))) {
      delete data[field]
    }
  })

  return data
}
