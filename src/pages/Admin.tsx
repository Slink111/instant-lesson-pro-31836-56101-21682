import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface Chapter {
  id: string;
  name: string;
  board: string;
  subject: string;
  class_number: number;
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

  const loadChapters = () => {
    const stored = localStorage.getItem('chapters');
    if (stored) {
      setChapters(JSON.parse(stored));
    }
  };

  const saveChapters = (updatedChapters: Chapter[]) => {
    localStorage.setItem('chapters', JSON.stringify(updatedChapters));
    setChapters(updatedChapters);
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newChapterName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a chapter name',
        variant: 'destructive',
      });
      return;
    }

    const newChapter: Chapter = {
      id: Date.now().toString(),
      name: newChapterName.trim(),
      board: newChapterBoard,
      subject: newChapterSubject,
      class_number: Number(newChapterClass),
    };

    const updatedChapters = [...chapters, newChapter];
    saveChapters(updatedChapters);

    toast({
      title: 'Success!',
      description: 'Chapter created successfully',
    });

    setNewChapterName('');
  };

  const handleDeleteChapter = (id: string) => {
    const updatedChapters = chapters.filter(c => c.id !== id);
    saveChapters(updatedChapters);
    
    toast({
      title: 'Deleted',
      description: 'Chapter removed successfully',
    });
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

        <div className="grid gap-6 max-w-4xl mx-auto">
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
        </div>
      </div>
    </div>
  );
};

export default Admin;
