import { ValidationChain } from 'express-validator'

export interface IValidator {
  run(): ValidationChain[]
}
