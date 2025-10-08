import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Upload, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Chapter {
  id: string;
  name: string;
  board: string;
  subject: string;
  class_number: number;
}

interface ContentFile {
  id: string;
  chapter_id: string;
  content_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
}

const Admin = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterBoard, setNewChapterBoard] = useState<'CBSE' | 'ICSE'>('CBSE');
  const [newChapterSubject, setNewChapterSubject] = useState('Physics');
  const [newChapterClass, setNewChapterClass] = useState('7');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedContentType, setSelectedContentType] = useState<'MCQ' | 'Long Answer' | 'HOTS'>('MCQ');
  const [uploading, setUploading] = useState(false);
  const [contentFiles, setContentFiles] = useState<ContentFile[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
      toast({
        title: 'Access Denied',
        description: 'You need admin privileges to access this page.',
        variant: 'destructive',
      });
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    loadChapters();
  }, []);

  useEffect(() => {
    if (selectedChapterId) {
      loadContentFiles();
    }
  }, [selectedChapterId]);

  const loadChapters = async () => {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load chapters',
        variant: 'destructive',
      });
    } else {
      setChapters(data || []);
    }
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newChapterName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a chapter name',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('chapters')
      .insert({
        name: newChapterName.trim(),
        board: newChapterBoard,
        subject: newChapterSubject,
        class_number: Number(newChapterClass),
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create chapter',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success!',
        description: 'Chapter created successfully',
      });

      setNewChapterName('');
      loadChapters();
    }
  };

  const handleDeleteChapter = async (id: string) => {
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete chapter',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Deleted',
        description: 'Chapter removed successfully',
      });
      loadChapters();
    }
  };

  const loadContentFiles = async () => {
    if (!selectedChapterId) return;

    const { data, error } = await supabase
      .from('content_files')
      .select('*')
      .eq('chapter_id', selectedChapterId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load content files',
        variant: 'destructive',
      });
    } else {
      setContentFiles(data || []);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChapterId) return;

    setUploading(true);
    const filePath = `${selectedChapterId}/${selectedContentType}/${Date.now()}-${file.name}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('content-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('content_files')
        .insert({
          chapter_id: selectedChapterId,
          content_type: selectedContentType,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Success!',
        description: 'File uploaded successfully',
      });

      loadContentFiles();
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteFile = async (fileId: string, filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('content-files')
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('content_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      toast({
        title: 'Deleted',
        description: 'File removed successfully',
      });

      loadContentFiles();
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getFilteredChapters = () => {
    return chapters.filter(
      c => 
        c.board === newChapterBoard && 
        c.subject === newChapterSubject && 
        c.class_number === Number(newChapterClass)
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate('/')} variant="ghost" className="mb-6 hover-scale">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Admin Panel
        </h1>

        <Tabs defaultValue="chapters" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chapters">Manage Chapters</TabsTrigger>
            <TabsTrigger value="files">Upload Files</TabsTrigger>
          </TabsList>

          <TabsContent value="chapters" className="space-y-6 mt-6">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Create New Chapter</CardTitle>
              <CardDescription>
                Add a new chapter for students to access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateChapter} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Board</Label>
                    <Select value={newChapterBoard} onValueChange={(v) => setNewChapterBoard(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE">ICSE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select value={newChapterSubject} onValueChange={setNewChapterSubject}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Computer">Computer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select value={newChapterClass} onValueChange={setNewChapterClass}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[7, 8, 9, 10, 11, 12].map((c) => (
                          <SelectItem key={c} value={String(c)}>
                            Class {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Chapter Name</Label>
                    <Input
                      value={newChapterName}
                      onChange={(e) => setNewChapterName(e.target.value)}
                      placeholder="e.g., Motion and Force"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full hover-scale">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Chapter
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle>Existing Chapters</CardTitle>
              <CardDescription>
                {newChapterBoard} • {newChapterSubject} • Class {newChapterClass}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getFilteredChapters().length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No chapters found for this selection
                </p>
              ) : (
                <div className="space-y-2">
                  {getFilteredChapters().map((chapter, index) => (
                    <div
                      key={chapter.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="font-medium">{chapter.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteChapter(chapter.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-6 mt-6">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Upload Content Files</CardTitle>
                <CardDescription>
                  Upload study materials for chapters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Chapter</Label>
                    <Select value={selectedChapterId} onValueChange={setSelectedChapterId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {chapters.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id}>
                            {chapter.board} • {chapter.subject} • Class {chapter.class_number} • {chapter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select value={selectedContentType} onValueChange={(v) => setSelectedContentType(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MCQ">MCQ</SelectItem>
                        <SelectItem value="Long Answer">Long Answer</SelectItem>
                        <SelectItem value="HOTS">HOTS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload">Choose File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    disabled={!selectedChapterId || uploading}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <p className="text-sm text-muted-foreground">
                    Supported formats: PDF, JPG, PNG, DOC, DOCX
                  </p>
                </div>
              </CardContent>
            </Card>

            {selectedChapterId && (
              <Card className="animate-scale-in" style={{ animationDelay: '100ms' }}>
                <CardHeader>
                  <CardTitle>Uploaded Files</CardTitle>
                  <CardDescription>
                    {chapters.find(c => c.id === selectedChapterId)?.name || 'Select a chapter'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {contentFiles.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No files uploaded yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {contentFiles.map((file, index) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{file.file_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {file.content_type} • {formatFileSize(file.file_size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteFile(file.id, file.file_path)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
