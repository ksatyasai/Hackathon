import { Request, Response } from 'express';
import { requireFields } from '../utils/validate.util.js';
import { findUserByEmail, createUser } from '../services/user.service.js';
import { comparePassword, hashPassword } from '../utils/hash.util.js';
import { signJwt } from '../services/jwt.service.js';
import { settings } from '../config/settings.js';

/**
 * Seed an admin if not present (for quick start)
 */
async function ensureAdminSeed() {
  const adminEmail = 'admin@demo.local';
  const existing = await findUserByEmail(adminEmail);
  if (!existing) {
    const hash = await hashPassword('Admin@123');
    await createUser(adminEmail, hash, ['Admin', 'Manager', 'Contributor', 'Viewer']);
    console.log('👤 Seeded admin: admin@demo.local / Admin@123');
  }
}

export async function me(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  res.json(req.user);
}

export async function login(req: Request, res: Response) {
  requireFields(req.body, ['email', 'password']);
  const { email, password } = req.body as { email: string; password: string };

  await ensureAdminSeed();

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signJwt({ id: String(user._id), email: user.email, roles: user.roles });
  res.cookie(settings.cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set true behind HTTPS/proxy in prod
    maxAge: 24 * 60 * 60 * 1000
  });
  res.json({ ok: true });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(settings.cookieName);
  res.json({ ok: true });
}
