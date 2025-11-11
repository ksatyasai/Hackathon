import { Request, Response } from 'express';
import { createDocument, getDocumentById, listDocuments } from '../services/document.service.js';
import path from 'node:path';
import fs from 'node:fs';

export async function createDoc(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const file = (req as any).file as Express.Multer.File | undefined;
  const { title, tags, sensitivity } = req.body as { title?: string; tags?: string; sensitivity?: 'low'|'medium'|'high' };

  if (!file) return res.status(400).json({ message: 'File is required' });

  const doc = await createDocument({
    title: title || file.originalname,
    type: file.mimetype,
    size: file.size,
    ownerId: req.user.id,
    ownerEmail: req.user.email,
    tags: tags ? tags.split(',').map(s => s.trim()).filter(Boolean) : [],
    sensitivity: sensitivity || 'low',
    storagePath: file.path
  });

  res.status(201).json({ id: String(doc._id) });
}

export async function listDocs(req: Request, res: Response) {
  const { q, tag, sort, limit } = req.query as any;
  const items = await listDocuments({
    q, tag, sort,
    limit: limit ? Number(limit) : undefined,
    ownerId: undefined // could filter by owner if needed
  });
  res.json({ items });
}

export async function getDoc(req: Request, res: Response) {
  const { id } = req.params;
  const d = await getDocumentById(id);
  if (!d) return res.status(404).json({ message: 'Not found' });
  res.json(d);
}

export async function downloadDoc(req: Request, res: Response) {
  const { id } = req.params;
  const { inline } = req.query as any;
  const d = await getDocumentById(id);
  if (!d) return res.status(404).json({ message: 'Not found' });

  const abs = path.resolve(d.storagePath);
  if (!fs.existsSync(abs)) return res.status(404).json({ message: 'File missing' });

  res.setHeader('Content-Type', d.type);
  const disposition = inline ? 'inline' : 'attachment';
  res.setHeader('Content-Disposition', `${disposition}; filename="${encodeURIComponent(d.title)}"`);

  const stream = fs.createReadStream(abs);
  stream.pipe(res);
}
