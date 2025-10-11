import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

interface Chapter {
  id: string;
  name: string;
  board: string;
  subject: string;
  class_number: number;
}

const Browse = () => {
  const { board, subject, classNum } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapters();
  }, [board, subject, classNum]);


  const fetchChapters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('board', board)
      .eq('subject', subject)
      .eq('class_number', Number(classNum))
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load chapters',
        variant: 'destructive',
      });
      setChapters([]);
    } else {
      setChapters(data || []);
    }
    setLoading(false);
  };


  return (
    <>
      <Helmet>
        <title>{`${board} Class ${classNum} ${subject} Study Material - Chapter-wise Notes & MCQs | Topper Guide`}</title>
        <meta name="description" content={`Free ${board} Class ${classNum} ${subject} study material with chapter-wise notes, MCQs with answers, short and long questions. Comprehensive ${subject} study notes for board exam preparation 2025.`} />
        <meta name="keywords" content={`${board} class ${classNum} ${subject} study material, ${board} ${subject} class ${classNum} notes, ${subject} class ${classNum} mcqs with answers, ${subject} class ${classNum} important questions, ${board} class ${classNum} ${subject} chapter wise notes`} />
        <link rel="canonical" href={`https://topperguide.in/browse/${board}/${subject}/${classNum}`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 hover-scale"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="secondary">{board}</Badge>
            <Badge variant="outline">Class {classNum}</Badge>
          </div>
          <h1 className="text-4xl font-bold text-primary">{subject}</h1>
          <p className="text-muted-foreground mt-2">
            Select a chapter to access study materials
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading chapters...</p>
          </div>
        ) : chapters.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No chapters available yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {chapters.map((chapter, index) => (
              <Card 
                key={chapter.id} 
                className="hover:shadow-lg transition-all duration-300 animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">
                      {index + 1}
                    </span>
                    {chapter.name}
                  </CardTitle>
                  <CardDescription>
                    Choose content type to study
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/content/${chapter.id}`)}
                    className="w-full hover-scale"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Study Material
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default Browse;
