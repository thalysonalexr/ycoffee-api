import { header, body } from 'express-validator'
import { IValidator } from "@domain/validators/IValidator";

export class StoreCoffee implements IValidator {
  public run() {
    return [
      header('Content-Type')
        .equals('application/json')
        .withMessage('Content-Type: application/json is required.'),

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
  }

  public static instance() {
    return new StoreCoffee().run()
  }
}
