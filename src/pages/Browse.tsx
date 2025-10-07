import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, BookOpen, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapters();
  }, [board, subject, classNum]);

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('board', board)
        .eq('subject', subject)
        .eq('class_number', Number(classNum))
        .order('chapter_order');

      if (error) throw error;
      setChapters(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const contentTypes = [
    { type: 'MCQ', icon: HelpCircle, label: 'MCQs', color: 'bg-blue-100 text-blue-700' },
    { type: 'Long Answer', icon: BookOpen, label: 'Long Answer', color: 'bg-green-100 text-green-700' },
    { type: 'HOTS', icon: FileText, label: 'HOTS Questions', color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6"
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
              <Card key={chapter.id} className="hover:shadow-lg transition-shadow">
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
                  <div className="flex flex-wrap gap-3">
                    {contentTypes.map(({ type, icon: Icon, label, color }) => (
                      <Button
                        key={type}
                        variant="outline"
                        onClick={() => navigate(`/content/${chapter.id}/${type}`)}
                        className="flex-1 min-w-[140px]"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
