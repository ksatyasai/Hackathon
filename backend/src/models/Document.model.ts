import mongoose, { Schema, InferSchemaType } from 'mongoose';

const DocumentSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },          // mime type
  size: { type: Number, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ownerEmail: { type: String },
  tags: { type: [String], default: [] },
  sensitivity: { type: String, enum: ['low','medium','high'], default: 'low' },
  storagePath: { type: String, required: true },    // path under /uploads
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

DocumentSchema.index({ title: 'text', tags: 1 });

export type DocumentDoc = InferSchemaType<typeof DocumentSchema> & { _id: mongoose.Types.ObjectId };
export const DocumentModel = mongoose.model('Document', DocumentSchema);
