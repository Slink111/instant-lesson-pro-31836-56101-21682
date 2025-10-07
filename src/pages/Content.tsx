import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: string;
  file_path: string;
  file_name: string;
  content_type: string;
}

interface Chapter {
  name: string;
  board: string;
  subject: string;
  class_number: number;
}

const Content = () => {
  const { chapterId, contentType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [chapterId, contentType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch chapter info
      const { data: chapterData, error: chapterError } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', chapterId)
        .single();

      if (chapterError) throw chapterError;
      setChapter(chapterData);

      // Fetch content
      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .select('*')
        .eq('chapter_id', chapterId)
        .eq('content_type', contentType);

      if (contentError) throw contentError;
      setContent(contentData || []);

      // If there's content, load the first file
      if (contentData && contentData.length > 0) {
        loadFile(contentData[0].file_path);
      }
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

  const loadFile = async (filePath: string) => {
    const { data } = supabase.storage
      .from('content-files')
      .getPublicUrl(filePath);

    setFileUrl(data.publicUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {chapter && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{chapter.name}</h1>
            <p className="text-muted-foreground">
              {chapter.board} • {chapter.subject} • Class {chapter.class_number} • {contentType}
            </p>
          </div>
        )}

        {content.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No content available yet for this section.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {content.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {content.map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        size="sm"
                        onClick={() => loadFile(item.file_path)}
                      >
                        {item.file_name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {fileUrl && (
              <Card>
                <CardContent className="p-6">
                  <iframe
                    src={fileUrl}
                    className="w-full h-[800px] rounded-lg border"
                    title="Content Viewer"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
