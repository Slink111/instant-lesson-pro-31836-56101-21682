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
  const { nickname, isAdmin, clearNickname } = useAuth();
  const navigate = useNavigate();

  const handleSubjectClick = (subject: string, classNum: number) => {
    navigate(`/browse/${selectedBoard}/${subject}/${classNum}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary animate-pulse">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Topper Guide
            </h1>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center">
            <Select value={selectedBoard} onValueChange={(v) => setSelectedBoard(v as 'CBSE' | 'ICSE')}>
              <SelectTrigger className="w-28 sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CBSE">CBSE</SelectItem>
                <SelectItem value="ICSE">ICSE</SelectItem>
              </SelectContent>
            </Select>

            {nickname ? (
              <>
                <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Hi, {nickname}!</span>
                {isAdmin && (
                  <Button onClick={() => navigate('/admin')} variant="outline" className="hover-scale text-xs sm:text-sm">
                    Admin
                  </Button>
                )}
                <Button onClick={() => clearNickname()} variant="ghost" size="icon" className="hover-scale">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="outline" className="hover-scale text-xs sm:text-sm">
                Set Nickname
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12 space-y-4 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Master Your Studies with <span className="text-primary">Expert Resources</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Access comprehensive study materials for Classes 7-12 including MCQs, Long Answer Notes, and Important HOTS Questions
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {subjects.map((subject, index) => (
            <Card 
              key={subject.name} 
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in hover-scale"
              style={{ animationDelay: `${index * 100}ms` }}
            >
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
                    className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-scale"
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
