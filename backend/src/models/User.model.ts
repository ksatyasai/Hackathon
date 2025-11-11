import mongoose, { Schema, InferSchemaType } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['Viewer'] },
  orgUnit: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };
export const UserModel = mongoose.model('User', UserSchema);
