export interface IEntity<Indexes> {
  data(...exclude: Indexes[]): object
}
