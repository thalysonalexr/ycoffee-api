import { Name, Email, Password, Role } from '@domain/values/User'

describe('Unit test to value objects User', () => {
  it('should be able create new valid name', () => {
    const name = 'Thalyson Rodrigues'
    expect(new Name(name).toString()).toBe(name)
  })

  it('should be not able create new name very short or long', () => {
    const name = 'Th'
    try {
      expect(new Name(name)).toThrow(Error)
    } catch (err) {}
  })

  it('shoulb be able create new email', () => {
    const email = 'thalysonrodrigues.dev@gmail.com'
    expect(new Email(email).toString()).toBe(email)
  })

  it('should be not able create new email invalid', () =>{
    const email = 'thalysonrodrigues.dev@gmailcom'
    try {
      expect(new Email(email)).toThrow(Error)
    } catch(err) {}
  })

  it('shoulb be able create new password', () => {
    const input = '123456'
    const passw = new Password(input).hash()

    expect(passw.compare(input)).toBe(true)
  })

  it('shoulb be not able create password very short', () => {
    const password = '1234'
    try {
      expect(new Password(password)).toThrow(Error)
    } catch (err) {}
  })

  it('should be able create new role', () => {
    expect(new Role('disabled').toString()).toBe('disabled')
  })
})
