import jwt from 'jsonwebtoken';

export function generateTokenJwt(secretKey: string, payload = {}) {
  return jwt.sign(payload, secretKey, {
    expiresIn: 86400,
    algorithm: 'HS256',
  });
}
