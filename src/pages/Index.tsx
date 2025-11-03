import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, BookOpen, Beaker, Microscope, Monitor, LogOut } from 'lucide-react';
import SmartSearch from '@/components/SmartSearch';

const subjects = [
  { name: 'Physics', icon: Beaker, color: 'from-blue-500 to-indigo-600' },
  { name: 'Chemistry', icon: BookOpen, color: 'from-green-500 to-emerald-600' },
  { name: 'Biology', icon: Microscope, color: 'from-pink-500 to-rose-600' },
  { name: 'Computer', icon: Monitor, color: 'from-purple-500 to-violet-600' },
];

const classes = [7, 8, 9, 10];

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
        <section className="text-center mb-8 sm:mb-12 space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Free CBSE & ICSE Study Material for Class 7-10 - <span className="text-primary">MCQs, Notes & Solutions</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Access comprehensive CBSE and ICSE study materials, chapter-wise MCQs with answers, short and long questions, NCERT solutions, and revision notes for Physics, Chemistry, Biology, and Computer Science - Classes 7-10. Free PDF downloads for board exam preparation 2025.
          </p>
          
          {/* Smart Search Bar */}
          <div className="px-4 mt-8">
            <SmartSearch defaultBoard={selectedBoard} />
          </div>
        </section>

        {/* Subjects Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto" aria-label="Study materials by subject">
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
                  Classes 7-10
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  {classes.map((classNum) => (
                  <Button
                    key={classNum}
                    variant="outline"
                    size="lg"
                    onClick={() => handleSubjectClick(subject.name, classNum)}
                    className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-scale font-semibold text-base"
                  >
                    Class {classNum}
                  </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* About Us Section */}
        <section className="mt-16 py-12 bg-[hsl(var(--study-light))] rounded-2xl animate-fade-in" style={{ animationDelay: '400ms' }} aria-label="About Topper Guide">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-[hsl(var(--study))]">
              Best Free Study Material for CBSE & ICSE Board Exam Preparation
            </h2>
            <p className="text-base sm:text-lg text-center text-muted-foreground leading-relaxed mb-8">
              Topper Guide offers free CBSE and ICSE study materials for classes 7 to 10. Download chapter-wise MCQs with answers PDF, 
              NCERT solutions, short and long question answers, previous year question papers solved, important questions for board exams 2025, 
              and comprehensive revision notes for Physics, Chemistry, Biology, and Computer Science. Our platform provides students with 
              quality educational resources including class 10 study material chapter wise free download, class 9 important questions with answers, 
              and class 8 board exam preparation materials. Master topics like light reflection and refraction MCQs, electricity numericals, 
              periodic table questions, life processes notes, chemical reactions, heredity and evolution, python programming, and database concepts.
            </p>
            
            {/* Quotes Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-center mb-8 text-[hsl(var(--study))]">
                Inspiration for Students
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <article className="bg-background p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 hover-scale border-l-4 border-[hsl(var(--study))]">
                  <blockquote className="text-foreground italic mb-3">
                    "Education is the most powerful weapon which you can use to change the world."
                  </blockquote>
                  <cite className="text-sm text-[hsl(var(--study))] font-semibold not-italic">— Nelson Mandela</cite>
                </article>
                
                <article className="bg-background p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 hover-scale border-l-4 border-[hsl(var(--study))]">
                  <blockquote className="text-foreground italic mb-3">
                    "The beautiful thing about learning is that no one can take it away from you."
                  </blockquote>
                  <cite className="text-sm text-[hsl(var(--study))] font-semibold not-italic">— B.B. King</cite>
                </article>
                
                <article className="bg-background p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 hover-scale border-l-4 border-[hsl(var(--study))]">
                  <blockquote className="text-foreground italic mb-3">
                    "Education is not preparation for life; education is life itself."
                  </blockquote>
                  <cite className="text-sm text-[hsl(var(--study))] font-semibold not-italic">— John Dewey</cite>
                </article>
                
                <article className="bg-background p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 hover-scale border-l-4 border-[hsl(var(--study))]">
                  <blockquote className="text-foreground italic mb-3">
                    "The only person who is educated is the one who has learned how to learn and change."
                  </blockquote>
                  <cite className="text-sm text-[hsl(var(--study))] font-semibold not-italic">— Carl Rogers</cite>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 py-8 text-center border-t">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Topper Guide. Empowering students to achieve excellence.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
