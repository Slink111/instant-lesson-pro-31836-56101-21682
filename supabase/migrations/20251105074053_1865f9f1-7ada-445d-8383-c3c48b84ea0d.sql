
-- Copy Class 7 CBSE chapters to Class 8 CBSE (one-time data transfer)
-- First insert the new Class 8 chapters
WITH new_chapters AS (
  INSERT INTO chapters (name, board, subject, class_number)
  SELECT name, board, subject, 8 as class_number
  FROM chapters
  WHERE board = 'CBSE' AND class_number = 7
  RETURNING id, name, subject
),
-- Map old chapter IDs to new ones
chapter_mapping AS (
  SELECT 
    c7.id as old_id,
    c8.id as new_id,
    c7.name,
    c7.subject
  FROM chapters c7
  CROSS JOIN new_chapters c8
  WHERE c7.board = 'CBSE' 
    AND c7.class_number = 7
    AND c7.name = c8.name
    AND c7.subject = c8.subject
)
-- Copy study materials from Class 7 to Class 8 chapters
INSERT INTO study_materials (chapter_id, content, created_at, updated_at)
SELECT 
  cm.new_id as chapter_id,
  sm.content,
  now() as created_at,
  now() as updated_at
FROM study_materials sm
JOIN chapter_mapping cm ON sm.chapter_id = cm.old_id;
