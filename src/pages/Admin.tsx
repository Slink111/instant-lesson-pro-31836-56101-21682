import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Plus } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Upload state
  const [selectedBoard, setSelectedBoard] = useState<'CBSE' | 'ICSE'>('CBSE');
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [selectedClass, setSelectedClass] = useState('7');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedContentType, setSelectedContentType] = useState<'MCQ' | 'Long Answer' | 'HOTS'>('MCQ');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Chapter creation state
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterBoard, setNewChapterBoard] = useState<'CBSE' | 'ICSE'>('CBSE');
  const [newChapterSubject, setNewChapterSubject] = useState('Physics');
  const [newChapterClass, setNewChapterClass] = useState('7');
  const [creating, setCreating] = useState(false);

  // Chapters list
  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges.',
        variant: 'destructive',
      });
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchChapters();
    }
  }, [isAdmin, selectedBoard, selectedSubject, selectedClass]);

  const fetchChapters = async () => {
    const { data } = await supabase
      .from('chapters')
      .select('*')
      .eq('board', selectedBoard)
      .eq('subject', selectedSubject)
      .eq('class_number', Number(selectedClass))
      .order('chapter_order');

    setChapters(data || []);
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const { error } = await supabase.from('chapters').insert({
        name: newChapterName,
        board: newChapterBoard,
        subject: newChapterSubject,
        class_number: Number(newChapterClass),
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Chapter created successfully!',
      });

      setNewChapterName('');
      fetchChapters();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedChapter || !user) return;

    setUploading(true);

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${selectedBoard}/${selectedSubject}/${selectedClass}/${selectedChapter}/${selectedContentType}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create content record
      const { error: dbError } = await supabase.from('content').insert({
        chapter_id: selectedChapter,
        content_type: selectedContentType,
        file_path: filePath,
        file_name: file.name,
        uploaded_by: user.id,
      });

      if (dbError) throw dbError;

      toast({
        title: 'Success',
        description: 'Content uploaded successfully!',
      });

      setFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate('/')} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">Upload Content</TabsTrigger>
            <TabsTrigger value="chapters">Manage Chapters</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Study Material</CardTitle>
                <CardDescription>
                  Upload files for students to access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFileUpload} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Board</Label>
                      <Select value={selectedBoard} onValueChange={(v) => setSelectedBoard(v as any)}>
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
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
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
                      <Label>Chapter</Label>
                      <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select chapter" />
                        </SelectTrigger>
                        <SelectContent>
                          {chapters.map((chapter) => (
                            <SelectItem key={chapter.id} value={chapter.id}>
                              {chapter.name}
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
                          <SelectItem value="MCQ">MCQs</SelectItem>
                          <SelectItem value="Long Answer">Long Answer</SelectItem>
                          <SelectItem value="HOTS">HOTS Questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file">File (PDF)</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={uploading || !selectedChapter}>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Content'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chapters">
            <Card>
              <CardHeader>
                <CardTitle>Create New Chapter</CardTitle>
                <CardDescription>
                  Add a new chapter to the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateChapter} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Chapter Name</Label>
                      <Input
                        value={newChapterName}
                        onChange={(e) => setNewChapterName(e.target.value)}
                        placeholder="e.g., Motion and Force"
                        required
                      />
                    </div>

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
                  </div>

                  <Button type="submit" disabled={creating}>
                    <Plus className="w-4 h-4 mr-2" />
                    {creating ? 'Creating...' : 'Create Chapter'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
