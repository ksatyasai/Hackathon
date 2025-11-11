import 'express';

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      roles: string[];
    }
    interface Request {
      user?: UserPayload;
    }
  }
}
