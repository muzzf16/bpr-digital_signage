-- companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  tagline TEXT,
  logo_url TEXT,
  primary_color VARCHAR(7),
  accent_color VARCHAR(7),
  timezone VARCHAR(64) DEFAULT 'Asia/Jakarta',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- assets table
CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  mime TEXT,
  width INT,
  height INT,
  size_bytes BIGINT,
  uploaded_by TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- products (rates) table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  interest_rate NUMERIC(6,3),
  currency VARCHAR(8) DEFAULT 'IDR',
  effective_date TIMESTAMP,
  display_until TIMESTAMP,
  terms TEXT,
  thumbnail_asset_id INT REFERENCES assets(id),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- promos table
CREATE TABLE promos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  body TEXT,
  image_asset_id INT REFERENCES assets(id),
  start_at TIMESTAMP,
  end_at TIMESTAMP,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- playlists table
CREATE TABLE playlists (
  id SERIAL PRIMARY KEY,
  name TEXT,
  company_id INT REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- playlist_items table
CREATE TABLE playlist_items (
  id SERIAL PRIMARY KEY,
  playlist_id INT REFERENCES playlists(id) ON DELETE CASCADE,
  position INT NOT NULL DEFAULT 0,
  item_type TEXT NOT NULL, -- 'promo'|'image'|'video'|'rate'|'economic'|'announcement'|'product'
  item_ref TEXT, -- productId or promo id or asset id etc.
  metadata JSONB, -- custom fields: title, url, duration, poster, productId etc.
  duration_sec INT DEFAULT 12,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- devices table
CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  name TEXT,
  playlist_id INT REFERENCES playlists(id),
  location TEXT,
  last_seen TIMESTAMP,
  status JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- announcements table
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  start_at TIMESTAMP,
  end_at TIMESTAMP,
  priority INT DEFAULT 10,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- audit logs table
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  entity TEXT,
  entity_id TEXT,
  action TEXT,
  payload JSONB,
  created_at TIMESTAMP DEFAULT now()
);