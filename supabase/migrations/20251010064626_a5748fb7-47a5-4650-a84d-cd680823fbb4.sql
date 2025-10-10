-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create study_materials table for blog-like content
CREATE TABLE public.study_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view study materials"
  ON public.study_materials
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create study materials"
  ON public.study_materials
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update study materials"
  ON public.study_materials
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete study materials"
  ON public.study_materials
  FOR DELETE
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_study_materials_updated_at
  BEFORE UPDATE ON public.study_materials
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();