-- 005_create_economic_data_table.sql
CREATE TABLE economic_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  date DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
  updated_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

-- Create a trigger to update the 'updated_at' field
CREATE TRIGGER IF NOT EXISTS update_economic_data_updated_at
AFTER UPDATE ON economic_data
BEGIN
  UPDATE economic_data SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
