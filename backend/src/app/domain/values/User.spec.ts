import faker from 'faker'

import { Name, Email, Password, Role, UserValueException } from '@domain/values/User'

describe('Unit test to value objects User', () => {
  it('should be able create new valid name', () => {
    const name = faker.name.findName()
    expect(new Name(name).toString()).toBe(name)
  })

  it('should be not able create new name very short or long', () => {
    const name = faker.name.findName().substring(0, 2)
    try {
      expect(new Name(name)).toThrow(UserValueException)
    } catch (err) {}
  })

  it('shoulb be able create new email', () => {
    const email = faker.internet.email().toLocaleLowerCase()
    expect(new Email(email).toString()).toBe(email)
  })

  it('should be not able create new email invalid format', () =>{
    const email = faker.internet.email().replace('@', '')
    try {
      expect(new Email(email)).toThrow(UserValueException)
    } catch(err) {}
  })

  it('shoulb be able create new password', () => {
    const input = faker.internet.password(6)
    const passw = new Password(input).hash()

    expect(passw.compare(input)).toBe(true)
  })

  it('shoulb be not able create password very short', () => {
    const password = faker.internet.password(3)
    try {
      expect(new Password(password)).toThrow(UserValueException)
    } catch (err) {}
  })

  it('should be able create new role', () => {
    expect(new Role('disabled').toString()).toBe('disabled')
  })
})
