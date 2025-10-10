import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Chapter {
  id: string;
  name: string;
  board: string;
  subject: string;
  class_number: number;
}

interface StudyMaterial {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Content = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [chapterId]);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: chapterData, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .maybeSingle();

    if (chapterError) {
      toast({
        title: 'Error',
        description: 'Failed to load chapter',
        variant: 'destructive',
      });
      setChapter(null);
    } else {
      setChapter(chapterData);
    }

    const { data: materialData, error: materialError } = await supabase
      .from('study_materials')
      .select('*')
      .eq('chapter_id', chapterId)
      .maybeSingle();

    if (materialError) {
      toast({
        title: 'Error',
        description: 'Failed to load study material',
        variant: 'destructive',
      });
      setStudyMaterial(null);
    } else {
      setStudyMaterial(materialData);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 hover-scale"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {chapter && (
          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{chapter.name}</h1>
            <p className="text-muted-foreground">
              {chapter.board} • {chapter.subject} • Class {chapter.class_number}
            </p>
          </div>
        )}

        {!studyMaterial ? (
          <Card className="animate-scale-in">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No study material available yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back later for study materials.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Study Material</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap">{studyMaterial.content}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Content;
