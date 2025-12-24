import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, BookOpen, Beaker, Microscope, LogOut, Home } from 'lucide-react';
import SmartSearch from '@/components/SmartSearch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const subjects = [
  { name: 'Physics', icon: Beaker, color: 'from-blue-500 to-indigo-600' },
  { name: 'Chemistry', icon: BookOpen, color: 'from-green-500 to-emerald-600' },
  { name: 'Biology', icon: Microscope, color: 'from-pink-500 to-rose-600' },
];

const classes = [7, 8, 9, 10];

const faqs = [
  {
    question: "What is Topper Guide and how can it help me prepare for board exams?",
    answer: "Topper Guide is a free educational platform offering comprehensive CBSE and ICSE study materials for classes 7-10. We provide chapter-wise MCQs, NCERT solutions, short and long answer questions, revision notes, and previous year papers to help students excel in Physics, Chemistry, and Biology board exams."
  },
  {
    question: "Are the study materials on Topper Guide free to download?",
    answer: "Yes, all study materials on Topper Guide are completely free. You can access and download chapter-wise notes, MCQs with answers, NCERT solutions, and revision materials for CBSE and ICSE boards without any subscription or payment."
  },
  {
    question: "Which subjects and classes are covered on Topper Guide?",
    answer: "Topper Guide covers Physics, Chemistry, and Biology for classes 7, 8, 9, and 10. We provide study materials for both CBSE and ICSE boards, including chapter-wise content aligned with the latest syllabus."
  },
  {
    question: "How are the MCQs helpful for board exam preparation?",
    answer: "Our chapter-wise MCQs with answers help students practice objective-type questions that are commonly asked in board exams. Regular practice improves speed, accuracy, and conceptual understanding, making exam preparation more effective."
  },
  {
    question: "Do you provide NCERT solutions for all chapters?",
    answer: "Yes, we provide detailed NCERT solutions for Physics, Chemistry, and Biology for classes 7-10. Each solution is explained step-by-step to help students understand the concepts and methodology behind the answers."
  },
  {
    question: "Can I download PDF files of study materials?",
    answer: "Yes, Topper Guide allows you to download study materials including notes, MCQs, and solutions in PDF format. This makes it convenient to study offline and revise anytime, anywhere."
  },
  {
    question: "How often is the content updated on Topper Guide?",
    answer: "Our content is regularly updated to align with the latest CBSE and ICSE syllabus changes. We ensure that all study materials reflect the current academic year requirements and board exam patterns."
  },
  {
    question: "What is the difference between CBSE and ICSE study materials?",
    answer: "CBSE materials follow the NCERT curriculum with focus on conceptual understanding, while ICSE materials are more detailed and application-based. Topper Guide provides separate, board-specific content for both to ensure relevant preparation."
  },
  {
    question: "How can I use the search feature effectively?",
    answer: "Our smart search feature allows you to find specific topics, chapters, or question types quickly. Simply type keywords like 'photosynthesis MCQ' or 'electricity numericals' to get relevant study materials instantly."
  },
  {
    question: "Are the revision notes suitable for last-minute exam preparation?",
    answer: "Yes, our revision notes are concise and cover all important points, formulas, and concepts. They are perfect for quick revision before exams and help reinforce key topics efficiently."
  },
  {
    question: "Do you provide previous year question papers with solutions?",
    answer: "Yes, Topper Guide offers previous year question papers with detailed solutions for both CBSE and ICSE boards. Practicing these helps students understand the exam pattern and types of questions asked."
  },
  {
    question: "How are the study materials organized on the website?",
    answer: "Study materials are organized by board (CBSE/ICSE), subject (Physics/Chemistry/Biology), and class (7-10). Within each section, content is further divided chapter-wise for easy navigation and systematic study."
  },
  {
    question: "Can Topper Guide help with class 10 board exam preparation?",
    answer: "Absolutely! Our class 10 section includes comprehensive materials specifically designed for board exam preparation, including important questions, marking scheme insights, and chapter-wise weightage analysis."
  },
  {
    question: "What topics are covered in Physics for class 10?",
    answer: "Class 10 Physics covers Light - Reflection and Refraction, Human Eye, Electricity, Magnetic Effects of Electric Current, and Sources of Energy. We provide MCQs, numericals, and detailed notes for each chapter."
  },
  {
    question: "What are the important chapters in Chemistry for board exams?",
    answer: "Important Chemistry chapters include Chemical Reactions and Equations, Acids Bases and Salts, Metals and Non-metals, Carbon and its Compounds, and Periodic Classification of Elements. All chapters have comprehensive study materials."
  },
  {
    question: "Which Biology chapters are most important for class 10?",
    answer: "Key Biology chapters for class 10 include Life Processes, Control and Coordination, How do Organisms Reproduce, Heredity and Evolution, and Our Environment. We cover all these with detailed notes and questions."
  },
  {
    question: "Is registration required to access study materials?",
    answer: "No registration is required to browse and access most study materials. However, creating a free account with a nickname allows you to track your progress and access personalized features."
  },
  {
    question: "How can I switch between CBSE and ICSE materials?",
    answer: "You can easily switch between CBSE and ICSE study materials using the board selector dropdown in the header. The content will automatically update to show materials relevant to your selected board."
  },
  {
    question: "Do you provide support for doubts and questions?",
    answer: "While Topper Guide primarily focuses on self-study materials, our detailed explanations and step-by-step solutions are designed to clear doubts. Each topic includes comprehensive coverage to address common student questions."
  },
  {
    question: "How can Topper Guide help me score better in exams?",
    answer: "Topper Guide helps improve scores through systematic chapter-wise study, regular MCQ practice, understanding concepts via NCERT solutions, and effective revision using our concise notes. Consistent use of our materials builds strong fundamentals and exam confidence."
  }
];

interface IndexProps {
  defaultBoard?: 'CBSE' | 'ICSE';
}

const Index = ({ defaultBoard = 'CBSE' }: IndexProps) => {
  const [selectedBoard, setSelectedBoard] = useState<'CBSE' | 'ICSE'>(defaultBoard);
  const { nickname, isAdmin, clearNickname } = useAuth();
  const navigate = useNavigate();

  const handleSubjectClick = (subject: string, classNum: number) => {
    navigate(`/browse/${selectedBoard.toLowerCase()}/${subject.toLowerCase()}/${classNum}`);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Helmet>
        <title>{selectedBoard === 'CBSE' ? 'Topper Guide | Free CBSE Study Material for Class 7-10 - MCQs, Notes & Solutions' : 'Topper Guide | Free ICSE Study Material for Class 7-10 - MCQs, Notes & Solutions'}</title>
        <meta name="description" content={`Access comprehensive ${selectedBoard} study materials, chapter-wise MCQs with answers, short and long questions, NCERT solutions, and revision notes for Physics, Chemistry, and Biology - Classes 7-10. Free PDF downloads for board exam preparation 2025.`} />
        <meta name="keywords" content={`${selectedBoard} study material, ${selectedBoard} notes, class 7-10, MCQs with answers, NCERT solutions, Physics notes, Chemistry notes, Biology notes, board exam preparation, free PDF download`} />
        <link rel="canonical" href={selectedBoard === 'CBSE' ? 'https://topperguide.in' : 'https://topperguide.in/mainicse'} />
        <meta property="og:title" content={`Topper Guide | Free ${selectedBoard} Study Material for Class 7-10`} />
        <meta property="og:description" content={`Access comprehensive ${selectedBoard} study materials, chapter-wise MCQs with answers, NCERT solutions, and revision notes for Physics, Chemistry, and Biology.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={selectedBoard === 'CBSE' ? 'https://topperguide.in' : 'https://topperguide.in/mainicse'} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Topper Guide",
            "url": "https://topperguide.in",
            "description": "Free CBSE and ICSE study materials for classes 7-10",
            "sameAs": "https://topperguide.in"
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      
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

      {/* Navigation Menu */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" aria-label="Main navigation">
        <div className="container mx-auto px-4">
          <NavigationMenu className="mx-auto">
            <NavigationMenuList className="flex-wrap justify-center">
              <NavigationMenuItem>
                <NavigationMenuLink 
                  href="/"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Physics</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[200px]">
                    {classes.map((classNum) => (
                      <li key={`physics-${classNum}`}>
                        <NavigationMenuLink asChild>
                          <a
                            href={`/browse/${selectedBoard.toLowerCase()}/physics/${classNum}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSubjectClick('Physics', classNum);
                            }}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Class {classNum}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Physics study materials
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Chemistry</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[200px]">
                    {classes.map((classNum) => (
                      <li key={`chemistry-${classNum}`}>
                        <NavigationMenuLink asChild>
                          <a
                            href={`/browse/${selectedBoard.toLowerCase()}/chemistry/${classNum}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSubjectClick('Chemistry', classNum);
                            }}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Class {classNum}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Chemistry study materials
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Biology</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[200px]">
                    {classes.map((classNum) => (
                      <li key={`biology-${classNum}`}>
                        <NavigationMenuLink asChild>
                          <a
                            href={`/browse/${selectedBoard.toLowerCase()}/biology/${classNum}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSubjectClick('Biology', classNum);
                            }}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Class {classNum}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Biology study materials
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink 
                  href="#about"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <section className="text-center mb-8 sm:mb-12 space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Free CBSE & ICSE Study Material for Class 7-10 - <span className="text-primary">MCQs, Notes & Solutions</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Access comprehensive CBSE and ICSE study materials, chapter-wise MCQs with answers, short and long questions, NCERT solutions, and revision notes for Physics, Chemistry, and Biology - Classes 7-10. Free PDF downloads for board exam preparation 2025.
          </p>
          
          {/* Smart Search Bar */}
          <div className="px-4 mt-8">
            <SmartSearch defaultBoard={selectedBoard} />
          </div>
        </section>

        {/* Subjects Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto" aria-label="Study materials by subject">
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
        <section id="about" className="mt-16 py-12 bg-[hsl(var(--study-light))] rounded-2xl animate-fade-in" style={{ animationDelay: '400ms' }} aria-label="About Topper Guide">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-[hsl(var(--study))]">
              Best Free Study Material for CBSE & ICSE Board Exam Preparation
            </h2>
            <p className="text-base sm:text-lg text-center text-muted-foreground leading-relaxed mb-8">
              Topper Guide offers free CBSE and ICSE study materials for classes 7 to 10. Download chapter-wise MCQs with answers PDF, 
              NCERT solutions, short and long question answers, previous year question papers solved, important questions for board exams 2025, 
              and comprehensive revision notes for Physics, Chemistry, and Biology. Our platform provides students with 
              quality educational resources including class 10 study material chapter wise free download, class 9 important questions with answers, 
              and class 8 board exam preparation materials. Master topics like light reflection and refraction MCQs, electricity numericals, 
              periodic table questions, life processes notes, chemical reactions, and heredity and evolution.
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

        {/* FAQ Section */}
        <section className="mt-16 py-12 animate-fade-in" style={{ animationDelay: '500ms' }} aria-label="Frequently Asked Questions">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-primary">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Find answers to common questions about CBSE and ICSE study materials, board exam preparation, and using Topper Guide.
            </p>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border rounded-lg px-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 py-8 border-t">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center gap-4 mb-4 text-sm">
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Topper Guide. Empowering students to achieve excellence.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
