import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';

interface Chapter {
  id: string;
  name: string;
  board: string;
  subject: string;
  class_number: number;
}

const Content = () => {
  const { chapterId, contentType } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [chapterId, contentType]);

  const fetchData = () => {
    setLoading(true);
    const stored = localStorage.getItem('chapters');
    if (stored) {
      const chapters = JSON.parse(stored);
      const found = chapters.find((c: Chapter) => c.id === chapterId);
      setChapter(found || null);
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
              {chapter.board} • {chapter.subject} • Class {chapter.class_number} • {contentType}
            </p>
          </div>
        )}

        <Card className="animate-scale-in">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Content viewing feature coming soon!
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Files will be displayed here once the admin uploads them.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Content;
