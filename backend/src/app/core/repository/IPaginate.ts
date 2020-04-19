export interface IPaginate<T> {
  pages: number | undefined,
  total: number,
  docs: T[]
}

export interface IFilter<T> {
  [key: string]: T
}
