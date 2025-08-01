
-- Add approval system to jobs and tenders
ALTER TABLE jobs ADD COLUMN is_approved BOOLEAN DEFAULT 0;
ALTER TABLE jobs ADD COLUMN approved_by TEXT;
ALTER TABLE jobs ADD COLUMN approved_at DATETIME;

ALTER TABLE tenders ADD COLUMN is_approved BOOLEAN DEFAULT 0;
ALTER TABLE tenders ADD COLUMN approved_by TEXT;
ALTER TABLE tenders ADD COLUMN approved_at DATETIME;
