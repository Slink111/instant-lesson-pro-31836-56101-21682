-- Create storage bucket for content files
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-files', 'content-files', true);

-- Create content_files table to track uploaded files
CREATE TABLE public.content_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('MCQ', 'Long Answer', 'HOTS')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_files ENABLE ROW LEVEL SECURITY;

-- Anyone can view content files
CREATE POLICY "Anyone can view content files"
ON public.content_files
FOR SELECT
USING (true);

-- Anyone can create content files (controlled by app-level auth)
CREATE POLICY "Anyone can create content files"
ON public.content_files
FOR INSERT
WITH CHECK (true);

-- Anyone can delete content files (controlled by app-level auth)
CREATE POLICY "Anyone can delete content files"
ON public.content_files
FOR DELETE
USING (true);

-- Storage policies for content-files bucket
CREATE POLICY "Public access to view files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'content-files');

CREATE POLICY "Anyone can upload files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'content-files');

CREATE POLICY "Anyone can delete files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'content-files');

-- Create index for faster queries
CREATE INDEX idx_content_files_chapter_content ON public.content_files(chapter_id, content_type);