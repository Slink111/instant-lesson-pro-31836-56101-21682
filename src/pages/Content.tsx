import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Chapter {
  id: string;
  name: string;
  board: string;
  subject: string;
  class_number: number;
}

interface ContentFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
}

const Content = () => {
  const { chapterId, contentType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [chapterId, contentType]);

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

    const { data: filesData, error: filesError } = await supabase
      .from('content_files')
      .select('*')
      .eq('chapter_id', chapterId)
      .eq('content_type', contentType)
      .order('created_at', { ascending: false });

    if (filesError) {
      toast({
        title: 'Error',
        description: 'Failed to load files',
        variant: 'destructive',
      });
      setFiles([]);
    } else {
      setFiles(filesData || []);
    }
    
    setLoading(false);
  };

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('content-files')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const renderFile = (file: ContentFile) => {
    const fileUrl = getFileUrl(file.file_path);

    if (file.mime_type === 'application/pdf') {
      return (
        <div className="w-full h-[600px] md:h-[800px] rounded-lg overflow-hidden border">
          <iframe
            src={fileUrl}
            className="w-full h-full"
            title={file.file_name}
          />
        </div>
      );
    }

    if (file.mime_type.startsWith('image/')) {
      return (
        <div className="w-full rounded-lg overflow-hidden border">
          <img
            src={fileUrl}
            alt={file.file_name}
            className="w-full h-auto"
          />
        </div>
      );
    }

    return (
      <Card>
        <CardContent className="py-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="font-medium mb-2">{file.file_name}</p>
          <Button asChild variant="outline">
            <a href={fileUrl} download={file.file_name}>
              <Download className="w-4 h-4 mr-2" />
              Download File
            </a>
          </Button>
        </CardContent>
      </Card>
    );
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

        {files.length === 0 ? (
          <Card className="animate-scale-in">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No files available yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back later for study materials.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{file.file_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderFile(file)}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
