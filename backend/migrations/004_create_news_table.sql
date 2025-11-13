-- 004_create_news_table.sql
CREATE TABLE news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  source TEXT,
  link TEXT,
  category TEXT,
  is_breaking BOOLEAN DEFAULT 0,
  publish_date DATETIME,
  created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
  updated_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

-- Create a trigger to update the 'updated_at' field
CREATE TRIGGER IF NOT EXISTS update_news_updated_at
AFTER UPDATE ON news
BEGIN
  UPDATE news SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
