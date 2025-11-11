import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Save, BookOpen, Image, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Chapter {
  id: string;
  name: string;
  board: string;
  subject: string;
  class_number: number;
}

interface StudyMaterial {
  id: string;
  chapter_id: string;
  content: string;
  created_at: string;
  updated_at: string;
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
  const [studyMaterialContent, setStudyMaterialContent] = useState('');
  const [existingMaterial, setExistingMaterial] = useState<StudyMaterial | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageAlt, setImageAlt] = useState('');

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
      loadStudyMaterial();
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

  const loadStudyMaterial = async () => {
    if (!selectedChapterId) return;

    const { data, error } = await supabase
      .from('study_materials')
      .select('*')
      .eq('chapter_id', selectedChapterId)
      .maybeSingle();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load study material',
        variant: 'destructive',
      });
      setExistingMaterial(null);
      setStudyMaterialContent('');
    } else {
      setExistingMaterial(data);
      setStudyMaterialContent(data?.content || '');
    }
  };

  const handleSaveStudyMaterial = async () => {
    if (!selectedChapterId || !studyMaterialContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please select a chapter and enter content',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      if (existingMaterial) {
        // Update existing material
        const { error } = await supabase
          .from('study_materials')
          .update({ content: studyMaterialContent.trim() })
          .eq('id', existingMaterial.id);

        if (error) throw error;
      } else {
        // Create new material
        const { error } = await supabase
          .from('study_materials')
          .insert({
            chapter_id: selectedChapterId,
            content: studyMaterialContent.trim(),
          });

        if (error) throw error;
      }

      toast({
        title: 'Success!',
        description: 'Study material saved successfully',
      });

      loadStudyMaterial();
    } catch (error: any) {
      toast({
        title: 'Save failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudyMaterial = async () => {
    if (!existingMaterial) return;

    const { error } = await supabase
      .from('study_materials')
      .delete()
      .eq('id', existingMaterial.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete study material',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Deleted',
        description: 'Study material removed successfully',
      });
      setExistingMaterial(null);
      setStudyMaterialContent('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChapterId) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    if (!imageAlt.trim()) {
      toast({
        title: 'Alt Text Required',
        description: 'Please enter a description for the image',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedChapterId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('content-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('content-files')
        .getPublicUrl(fileName);

      const imageMarkdown = `\n![${imageAlt}](${publicUrl})\n`;
      setStudyMaterialContent(prev => prev + imageMarkdown);
      setImageAlt('');

      toast({
        title: 'Success!',
        description: 'Image uploaded successfully',
      });

      e.target.value = '';
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getFilteredChapters = () => {
    return chapters.filter(
      c => 
        c.board === newChapterBoard && 
        c.subject === newChapterSubject && 
        c.class_number === Number(newChapterClass)
    );
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
            <TabsTrigger value="content">Write Study Material</TabsTrigger>
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

          <TabsContent value="content" className="space-y-6 mt-6">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Write Study Material</CardTitle>
                <CardDescription>
                  Create or edit study material for chapters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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

                {selectedChapterId && (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="study-content">Study Material Content</Label>
                        <span className="text-sm text-muted-foreground">
                          Word count: {getWordCount(studyMaterialContent)}
                        </span>
                      </div>
                      <Textarea
                        id="study-content"
                        value={studyMaterialContent}
                        onChange={(e) => setStudyMaterialContent(e.target.value)}
                        placeholder="Write the study material here..."
                        className="min-h-[400px] font-mono"
                      />
                      <p className="text-sm text-muted-foreground">
                        Write your study material content. You can format it with line breaks and spacing.
                        Use ![alt text](image-url) format for images.
                      </p>
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                      <div className="flex items-center gap-2">
                        <Image className="w-5 h-5 text-primary" />
                        <Label className="text-base font-semibold">Add Image</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="image-alt">Image Description (Alt Text) *</Label>
                        <Input
                          id="image-alt"
                          value={imageAlt}
                          onChange={(e) => setImageAlt(e.target.value)}
                          placeholder="e.g., Diagram showing light reflection"
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                          Describe what the image shows for accessibility and SEO
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image-upload">Upload Image</Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading || !imageAlt.trim()}
                          className="cursor-pointer"
                        />
                      </div>

                      {uploading && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Upload className="w-4 h-4 animate-pulse" />
                          Uploading image...
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleSaveStudyMaterial}
                        disabled={saving || !studyMaterialContent.trim()}
                        className="flex-1 hover-scale"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {existingMaterial ? 'Update' : 'Save'} Study Material
                      </Button>
                      
                      {existingMaterial && (
                        <Button
                          variant="destructive"
                          onClick={handleDeleteStudyMaterial}
                          className="hover-scale"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
