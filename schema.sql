CREATE TABLE IF NOT EXISTS gigs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  venue TEXT DEFAULT '',
  description TEXT DEFAULT '',
  sort_date TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS music_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT DEFAULT '',
  platform TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip TEXT PRIMARY KEY,
  count INTEGER DEFAULT 1,
  first_attempt_at TEXT DEFAULT (datetime('now')),
  last_attempt_at TEXT DEFAULT (datetime('now')),
  locked_until TEXT
);

-- Seed initial gigs
INSERT INTO gigs (date, title, venue, description, sort_date) VALUES
  ('Coming Up', 'Your Event Here', '', 'Available for booking — weddings, parties, festivals, pubs', '9999-12-31'),
  ('Local Session', 'Plough & the Stars', 'San Francisco, CA', 'Regular session', '2025-01-01'),
  ('Local Session', 'Starry Plough', 'Berkeley, CA', 'Irish trad night', '2025-01-02');
