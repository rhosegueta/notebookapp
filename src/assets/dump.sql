CREATE TABLE IF NOT EXISTS notebooktable(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notebook_title TEXT
);
INSERT or IGNORE INTO notebooktable( notebook_title ) VALUES ( 'Test Notebook 1' );
INSERT or IGNORE INTO notebooktable( notebook_title ) VALUES ( 'Test Notebook 2' );
INSERT or IGNORE INTO notebooktable( notebook_title ) VALUES ( 'Test Notebook 3' );

CREATE TABLE IF NOT EXISTS notetable(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_title TEXT,
    note_text TEXT,
    notebook_id INTEGER
);
INSERT or IGNORE INTO notetable( note_title, note_text, notebook_id ) VALUES ( 'Test Note 1', 'This is the text for test note 1', 1 );
INSERT or IGNORE INTO notetable( note_title, note_text, notebook_id ) VALUES ( 'Test Note 2', 'This is the text for test note 2', 2 );
INSERT or IGNORE INTO notetable( note_title, note_text, notebook_id ) VALUES ( 'Test Note 3', 'This is the text for test note 3', 3 );
INSERT or IGNORE INTO notetable( note_title, note_text, notebook_id ) VALUES ( 'Test Note 4', 'This is the text for test note 4', 1 );
INSERT or IGNORE INTO notetable( note_title, note_text, notebook_id ) VALUES ( 'Test Note 5', 'This is the text for test note 5', 2 );
INSERT or IGNORE INTO notetable( note_title, note_text, notebook_id ) VALUES ( 'Test Note 6', 'This is the text for test note 6', 3 );