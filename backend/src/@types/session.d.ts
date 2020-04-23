declare namespace Express {
  type Role = 'user' | 'admin'

  type TokenDecoded = {
    id: string,
    role: Role
    iat: string,
    exp: string,
  }

  interface Request {
    session: TokenDecoded
  }
}
