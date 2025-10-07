-- Create chapters table
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  board TEXT NOT NULL CHECK (board IN ('CBSE', 'ICSE')),
  subject TEXT NOT NULL CHECK (subject IN ('Physics', 'Chemistry', 'Biology', 'Computer')),
  class_number INTEGER NOT NULL CHECK (class_number >= 7 AND class_number <= 12),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view chapters (public read access)
CREATE POLICY "Anyone can view chapters"
ON public.chapters
FOR SELECT
USING (true);

-- Allow authenticated users to insert chapters (for admin panel)
CREATE POLICY "Authenticated users can create chapters"
ON public.chapters
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to delete chapters (for admin panel)
CREATE POLICY "Authenticated users can delete chapters"
ON public.chapters
FOR DELETE
TO authenticated
USING (true);

-- Create index for faster queries
CREATE INDEX idx_chapters_board_subject_class ON public.chapters(board, subject, class_number);