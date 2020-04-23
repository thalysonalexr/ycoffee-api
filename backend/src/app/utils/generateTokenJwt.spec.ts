import { generateTokenJwt } from '@app/utils'

test('should be able generate valid token', () => {
  const token = generateTokenJwt('secret@key', { id: 12 })

  expect(token).toStrictEqual(expect.any(String))
  expect(token.split('.').length).toBe(3)
})

test('should be able generate token jwt without payload', () => {
  const token = generateTokenJwt('secret@key')

  expect(token).toStrictEqual(expect.any(String))
})

test('should be able generate token jwt with payload', () => {
  const token = generateTokenJwt('secret@key', { id: 28 })

  expect(token).toStrictEqual(expect.any(String))
})
