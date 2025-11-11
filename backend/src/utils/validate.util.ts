export function requireFields<T extends Record<string, any>>(obj: T, fields: (keyof T)[]) {
  const missing = fields.filter(f => obj[f] === undefined || obj[f] === null || obj[f] === '');
  if (missing.length) {
    const msg = `Missing fields: ${missing.join(', ')}`;
    const err = new Error(msg) as any;
    err.status = 400;
    throw err;
  }
}
