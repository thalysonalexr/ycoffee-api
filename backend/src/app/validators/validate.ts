import { param, header, body } from 'express-validator'
import { isValidObjectId } from '@domain/repository/utils'

export const mongoId = [
  param('id')
    .custom(value => isValidObjectId(value))
    .withMessage('The ID passed as a parameter is invalid.')
]

export const contentJson = [
  header('Content-Type')
    .contains('application/json')
    .withMessage('Content-Type: application/json is required.')
]

export const formData = [
  header('Content-Type')
    .contains('multipart/form-data')
    .withMessage('Content-Type: multipart/form-data is required.')
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
    .notEmpty()
    .withMessage('Name is not empty')
    .isLength({ max: 255 })
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
    .notEmpty()
    .withMessage('Type is not empty')
    .isLength({ min: 1, max: 45 })
    .withMessage('Exceeded size for type coffee field.')
    .trim(),

  body('description')
    .exists()
    .withMessage('Description is required.')
    .notEmpty()
    .withMessage('Description is not empty')
    .isLength({ max: 255 })
    .withMessage('Exceeded size for description field.')
    .trim(),

  body('ingredients')
    .exists()
    .withMessage('Ingredients is required.')
    .isArray()
    .withMessage('The field must be array.')
    .custom((value) => value.every((ingredient: string) => ingredient.length <= 45))
    .withMessage('Each ingredient must contain a maximum of 45 characters.'),

  body('preparation')
    .exists()
    .withMessage('Preparation is required.')
    .notEmpty()
    .withMessage('Description is not empty')
    .trim(),

  body('timePrepare')
    .optional()
    .isInt()
    .withMessage('Set a time prepare a coffee in minutes.'),

  body('portions')
    .optional()
    .isInt()
    .withMessage('Set a quantity portions in number integer.'),
]
