-- 006_create_display_settings_table.sql
CREATE TABLE display_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
  updated_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

-- Create a trigger to update the 'updated_at' field
CREATE TRIGGER IF NOT EXISTS update_display_settings_updated_at
AFTER UPDATE ON display_settings
BEGIN
  UPDATE display_settings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
