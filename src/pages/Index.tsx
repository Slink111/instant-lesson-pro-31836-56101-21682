import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, BookOpen, Beaker, Microscope, Monitor, LogOut } from 'lucide-react';

const subjects = [
  { name: 'Physics', icon: Beaker, color: 'from-blue-500 to-indigo-600' },
  { name: 'Chemistry', icon: BookOpen, color: 'from-green-500 to-emerald-600' },
  { name: 'Biology', icon: Microscope, color: 'from-pink-500 to-rose-600' },
  { name: 'Computer', icon: Monitor, color: 'from-purple-500 to-violet-600' },
];

const classes = [7, 8, 9, 10, 11, 12];

const Index = () => {
  const [selectedBoard, setSelectedBoard] = useState<'CBSE' | 'ICSE'>('CBSE');
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSubjectClick = (subject: string, classNum: number) => {
    navigate(`/browse/${selectedBoard}/${subject}/${classNum}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Topper Guide
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedBoard} onValueChange={(v) => setSelectedBoard(v as 'CBSE' | 'ICSE')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CBSE">CBSE</SelectItem>
                <SelectItem value="ICSE">ICSE</SelectItem>
              </SelectContent>
            </Select>

            {user ? (
              <>
                {isAdmin && (
                  <Button onClick={() => navigate('/admin')} variant="outline">
                    Admin Panel
                  </Button>
                )}
                <Button onClick={() => signOut()} variant="ghost" size="icon">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="outline">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold">
            Master Your Studies with <span className="text-primary">Expert Resources</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access comprehensive study materials for Classes 7-12 including MCQs, Long Answer Notes, and Important HOTS Questions
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {subjects.map((subject) => (
            <Card key={subject.name} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardHeader className={`bg-gradient-to-br ${subject.color} text-white`}>
                <div className="flex items-center gap-3">
                  <subject.icon className="w-8 h-8" />
                  <CardTitle className="text-xl">{subject.name}</CardTitle>
                </div>
                <CardDescription className="text-white/90">
                  Classes 7-12
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {classes.map((classNum) => (
                    <Button
                      key={classNum}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSubjectClick(subject.name, classNum)}
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {classNum}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
