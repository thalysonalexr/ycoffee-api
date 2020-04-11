import { body, header } from 'express-validator'

import { IValidator } from '@domain/validators/IValidator'

export class StoreSession implements IValidator {
  public run() {
    return [
      header('Content-Type')
        .equals('application/json')
        .withMessage('Content-Type: application/json is required.'),

      body('email')
        .isEmail()
        .withMessage('Enter a valid e-mail.')
        .isLength({ max: 100 })
        .withMessage('Exceeded size for email field.'),

      body('password')
        .isLength({ min: 5, max: 255 })
        .withMessage('The password must contain between 5 and 255 characters.'),
    ]
  }

  public static instance() {
    return new StoreSession().run()
  }
}
