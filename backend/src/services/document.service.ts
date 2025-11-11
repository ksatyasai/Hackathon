import { DocumentModel } from '../models/Document.model.js';
import { Types } from 'mongoose';

export async function createDocument(params: {
  title: string;
  type: string;
  size: number;
  ownerId: string;
  ownerEmail?: string;
  tags?: string[];
  sensitivity?: 'low'|'medium'|'high';
  storagePath: string;
}) {
  return DocumentModel.create({
    ...params,
    tags: params.tags || [],
    sensitivity: params.sensitivity || 'low'
  });
}

export async function listDocuments(filter: {
  q?: string; tag?: string; ownerId?: string; sort?: string; limit?: number;
}) {
  const query: any = {};
  if (filter.q) query.$text = { $search: filter.q };
  if (filter.tag) query.tags = filter.tag;
  if (filter.ownerId) query.ownerId = new Types.ObjectId(filter.ownerId);

  const sort: any = {};
  if (filter.sort) {
    const s = filter.sort.startsWith('-') ? -1 : 1;
    const key = filter.sort.replace(/^-/, '');
    sort[key] = s;
  } else {
    sort.createdAt = -1;
  }

  const limit = Math.min(Math.max(filter.limit || 50, 1), 100);

  const items = await DocumentModel.find(query).sort(sort).limit(limit).lean().exec();
  return items;
}

export async function getDocumentById(id: string) {
  return DocumentModel.findById(id).lean().exec();
}
