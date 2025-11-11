import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../services/jwt.service.js';
import { settings } from '../config/settings.js';

export function authGuard(required = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    const cookieToken = req.cookies?.[settings.cookieName];
    const authHeader = req.headers.authorization;
    const bearer = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const token = cookieToken || bearer;

    if (!token) {
      if (required) return res.status(401).json({ message: 'Unauthorized' });
      return next();
    }

    try {
      const payload = verifyJwt(token);
      req.user = { id: payload.id, email: payload.email, roles: payload.roles };
      return next();
    } catch {
      if (required) return res.status(401).json({ message: 'Invalid token' });
      return next();
    }
  };
}

export function requireRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const ok = req.user.roles.some(r => roles.includes(r));
    if (!ok) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
