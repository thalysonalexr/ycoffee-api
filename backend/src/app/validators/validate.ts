import { param, header, body } from 'express-validator'
import { isValidObjectId } from 'mongoose'

export const mongoId = [
  param('id')
    .custom(value => isValidObjectId(value))
    .withMessage('The ID passed as a parameter is invalid.')
]

export const contentJson = [
  header('Content-Type')
    .equals('application/json')
    .withMessage('Content-Type: application/json is required.')
]

export const authorization = [
  header('Authorization')
    .exists()
    .withMessage('Set Bearer Token in authorization request.'),
]

export const user = [
  body('name')
    .exists()
    .withMessage('Name is required.')
    .trim(),

  body('email')
    .isEmail()
    .withMessage('Enter a valid e-mail.')
    .isLength({ max: 100 })
    .withMessage('Exceeded size for email field.'),

  body('password')
    .isLength({ min: 5, max: 255 })
    .withMessage('The password must contain between 5 and 255 characters.'),
]

export const session = [
  body('email')
    .isEmail()
    .withMessage('Enter a valid e-mail.')
    .isLength({ max: 100 })
    .withMessage('Exceeded size for email field.'),

  body('password')
    .isLength({ min: 5, max: 255 })
    .withMessage('The password must contain between 5 and 255 characters.'),
]

export const coffee = [
  body('type')
    .exists()
    .withMessage('Type coffee is required.')
    .isLength({ min: 1, max: 45 })
    .withMessage('Exceeded size for type coffee field.')
    .trim(),

  body('description')
    .exists()
    .withMessage('Description is required.')
    .isLength({ min: 20, max: 255 })
    .withMessage('Exceeded size for description field.'),

  body('ingredients')
    .exists()
    .withMessage('Ingredients is required.')
    .isArray()
    .withMessage('The field must be array.'),

  body('preparation')
    .exists()
    .withMessage('Preparation is required.')
    .isLength({ min: 45})
    .withMessage('Write about like do this coffee.'),

  body('timePrepare')
    .optional()
    .isInt()
    .withMessage('Set a time prepare a coffee in minutes.'),

  body('portions')
    .optional()
    .isInt()
    .withMessage('Set a quantity portions in number integer.'),

  body('picture')
    .exists()
    .withMessage('Picture URL is required.'),
]
