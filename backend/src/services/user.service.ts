import { UserModel, UserDoc } from '../models/User.model.js';

export async function findUserByEmail(email: string): Promise<UserDoc | null> {
  return UserModel.findOne({ email }).lean().exec() as any;
}

export async function createUser(email: string, passwordHash: string, roles: string[] = ['Viewer']) {
  return UserModel.create({ email, passwordHash, roles });
}
