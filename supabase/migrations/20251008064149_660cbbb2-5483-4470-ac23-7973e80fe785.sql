-- Fix RLS policy for chapters table to allow insertions without Supabase auth
-- Since the app uses custom localStorage auth, we need to allow public inserts

DROP POLICY IF EXISTS "Authenticated users can create chapters" ON public.chapters;
DROP POLICY IF EXISTS "Authenticated users can delete chapters" ON public.chapters;

-- Allow anyone to create chapters (controlled by app-level auth)
CREATE POLICY "Anyone can create chapters"
ON public.chapters
FOR INSERT
WITH CHECK (true);

-- Allow anyone to delete chapters (controlled by app-level auth)
CREATE POLICY "Anyone can delete chapters"
ON public.chapters
FOR DELETE
USING (true);