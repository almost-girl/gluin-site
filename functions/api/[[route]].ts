import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/cloudflare-pages';

type Bindings = {
  DB: D1Database;
  ADMIN_PASSWORD_HASH?: string;
  CONTACT_EMAIL?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

// ── Public API ──

app.get('/api/gigs', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, date, title, venue, description FROM gigs ORDER BY sort_date ASC, created_at DESC'
  ).all();
  return c.json(results);
});

app.get('/api/gallery', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, image_url, alt_text, caption FROM gallery_items ORDER BY sort_order ASC, created_at DESC'
  ).all();
  return c.json(results);
});

app.get('/api/music', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, title, url, platform FROM music_links ORDER BY sort_order ASC, created_at DESC'
  ).all();
  return c.json(results);
});

// ── Constant-Time Utilities ──

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  let result = 0;
  const len = a.length;
  if (len !== b.length) {
    // Compare against self to avoid leaking length difference timing
    for (let i = 0; i < len; i++) result |= a[i] ^ a[i];
    return false;
  }
  for (let i = 0; i < len; i++) result |= a[i] ^ b[i];
  return result === 0;
}

async function verifyPassword(input: string, storedHash: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(input));
  const hex = Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  return timingSafeEqual(encoder.encode(storedHash), encoder.encode(hex));
}

// ── Rate Limiting ──

async function recordFailedAttempt(db: D1Database, ip: string) {
  const { results } = await db.prepare(
    'SELECT count, first_attempt_at FROM login_attempts WHERE ip = ?'
  ).bind(ip).all();

  if (results && results.length > 0) {
    const row = results[0];
    const count = (row.count as number) + 1;
    const firstAttempt = new Date(row.first_attempt_at as string);
    const now = new Date();
    const windowMs = 15 * 60 * 1000;

    let lockedUntil: string | null = null;
    if (count >= 10) {
      lockedUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    } else if (count >= 5 && (now.getTime() - firstAttempt.getTime()) < windowMs) {
      lockedUntil = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
    }

    await db.prepare(
      'UPDATE login_attempts SET count = ?, last_attempt_at = ?, locked_until = ? WHERE ip = ?'
    ).bind(count, now.toISOString(), lockedUntil, ip).run();
  } else {
    await db.prepare(
      'INSERT INTO login_attempts (ip, count) VALUES (?, 1)'
    ).bind(ip).run();
  }
}

async function isLockedOut(db: D1Database, ip: string): Promise<boolean> {
  const { results } = await db.prepare(
    'SELECT locked_until FROM login_attempts WHERE ip = ?'
  ).bind(ip).all();
  if (!results || results.length === 0) return false;
  const lockedUntil = results[0].locked_until as string | null;
  if (!lockedUntil) return false;
  return new Date(lockedUntil) > new Date();
}

// ── Admin Auth Middleware ──

async function adminAuth(c: any, next: any) {
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const password = c.req.header('X-Admin-Password');

  if (!password || !c.env.ADMIN_PASSWORD_HASH) {
    if (password) await recordFailedAttempt(c.env.DB, ip);
    return c.json({ error: 'Unauthorized' }, 401);
  }

  if (await isLockedOut(c.env.DB, ip)) {
    return c.json({ error: 'Too many failed attempts. Try again later.' }, 429);
  }

  const match = await verifyPassword(password, c.env.ADMIN_PASSWORD_HASH);

  if (!match) {
    await recordFailedAttempt(c.env.DB, ip);
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Clear any prior attempts on success
  await c.env.DB.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run();
  await next();
}

// ── Admin Login ──

app.post('/api/admin/login', async (c) => {
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  let body: { password?: string };
  try { body = await c.req.json(); } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }

  if (!body.password || !c.env.ADMIN_PASSWORD_HASH) {
    await recordFailedAttempt(c.env.DB, ip);
    return c.json({ error: 'Invalid password' }, 401);
  }

  if (await isLockedOut(c.env.DB, ip)) {
    return c.json({ error: 'Too many failed attempts. Try again later.' }, 429);
  }

  const match = await verifyPassword(body.password, c.env.ADMIN_PASSWORD_HASH);

  if (!match) {
    await recordFailedAttempt(c.env.DB, ip);
    return c.json({ error: 'Invalid password' }, 401);
  }

  await c.env.DB.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run();
  return c.json({ success: true });
});

// ── Admin CRUD - Gigs ──

app.get('/api/admin/gigs', adminAuth, async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM gigs ORDER BY sort_date DESC, created_at DESC'
  ).all();
  return c.json(results);
});

app.post('/api/admin/gigs', adminAuth, async (c) => {
  let body: any;
  try { body = await c.req.json(); } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const { date, title, venue, description, sort_date } = body;
  if (!date || !title) return c.json({ error: 'Date and title required' }, 400);

  const result = await c.env.DB.prepare(
    'INSERT INTO gigs (date, title, venue, description, sort_date) VALUES (?, ?, ?, ?, ?)'
  ).bind(date, title, venue || '', description || '', sort_date || date).run();

  return c.json({ id: result.meta.last_row_id, success: true });
});

app.put('/api/admin/gigs/:id', adminAuth, async (c) => {
  const id = c.req.param('id');
  let body: any;
  try { body = await c.req.json(); } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const { date, title, venue, description, sort_date } = body;

  await c.env.DB.prepare(
    `UPDATE gigs SET date = ?, title = ?, venue = ?, description = ?, sort_date = ?, updated_at = datetime('now') WHERE id = ?`
  ).bind(date, title, venue || '', description || '', sort_date || date, id).run();

  return c.json({ success: true });
});

app.delete('/api/admin/gigs/:id', adminAuth, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM gigs WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// ── Admin CRUD - Gallery ──

app.get('/api/admin/gallery', adminAuth, async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM gallery_items ORDER BY sort_order ASC, created_at DESC'
  ).all();
  return c.json(results);
});

app.post('/api/admin/gallery', adminAuth, async (c) => {
  let body: any;
  try { body = await c.req.json(); } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const { image_url, alt_text, caption, sort_order } = body;
  if (!image_url) return c.json({ error: 'Image URL required' }, 400);

  const result = await c.env.DB.prepare(
    'INSERT INTO gallery_items (image_url, alt_text, caption, sort_order) VALUES (?, ?, ?, ?)'
  ).bind(image_url, alt_text || '', caption || '', sort_order || 0).run();

  return c.json({ id: result.meta.last_row_id, success: true });
});

app.put('/api/admin/gallery/:id', adminAuth, async (c) => {
  const id = c.req.param('id');
  let body: any;
  try { body = await c.req.json(); } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const { image_url, alt_text, caption, sort_order } = body;

  await c.env.DB.prepare(
    'UPDATE gallery_items SET image_url = ?, alt_text = ?, caption = ?, sort_order = ? WHERE id = ?'
  ).bind(image_url, alt_text || '', caption || '', sort_order || 0, id).run();

  return c.json({ success: true });
});

app.delete('/api/admin/gallery/:id', adminAuth, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM gallery_items WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// ── Admin CRUD - Music ──

app.get('/api/admin/music', adminAuth, async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM music_links ORDER BY sort_order ASC, created_at DESC'
  ).all();
  return c.json(results);
});

app.post('/api/admin/music', adminAuth, async (c) => {
  let body: any;
  try { body = await c.req.json(); } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const { title, url, platform, sort_order } = body;
  if (!title) return c.json({ error: 'Title required' }, 400);

  const result = await c.env.DB.prepare(
    'INSERT INTO music_links (title, url, platform, sort_order) VALUES (?, ?, ?, ?)'
  ).bind(title, url || '', platform || '', sort_order || 0).run();

  return c.json({ id: result.meta.last_row_id, success: true });
});

app.put('/api/admin/music/:id', adminAuth, async (c) => {
  const id = c.req.param('id');
  let body: any;
  try { body = await c.req.json(); } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const { title, url, platform, sort_order } = body;

  await c.env.DB.prepare(
    'UPDATE music_links SET title = ?, url = ?, platform = ?, sort_order = ? WHERE id = ?'
  ).bind(title, url || '', platform || '', sort_order || 0, id).run();

  return c.json({ success: true });
});

app.delete('/api/admin/music/:id', adminAuth, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM music_links WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// ── Pages handler ──

export const onRequest = handle(app);
