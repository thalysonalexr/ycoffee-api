export function filterObjectFields<T extends object, K extends keyof T>(data: T, ...exclude: K[]) {
  (Object.keys(data) as Array<keyof typeof data>).forEach(field => {
    if (data[field] === undefined || JSON.stringify(data[field]) === '{}' || exclude.includes((field as K))) {
      delete data[field]
    }
  })

  return data
}
