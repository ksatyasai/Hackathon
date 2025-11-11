import jwt from 'jsonwebtoken';
import { settings } from '../config/settings.js';

export type JwtPayload = { id: string; email: string; roles: string[] };

export function signJwt(payload: JwtPayload) {
  // Fix: Spread the payload into a new object
  return jwt.sign({ ...payload }, settings.jwtSecret, {
    expiresIn: settings.jwtExpires,
  });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, settings.jwtSecret) as JwtPayload;
}