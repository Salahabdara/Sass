
CREATE TABLE tenders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  reference_number TEXT,
  category TEXT,
  description TEXT,
  requirements TEXT,
  budget_range TEXT,
  submission_deadline DATETIME,
  contact_email TEXT,
  contact_phone TEXT,
  tender_documents_url TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
