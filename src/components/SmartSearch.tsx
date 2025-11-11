import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface SmartSearchProps {
  defaultBoard: 'CBSE' | 'ICSE';
}

const SmartSearch = ({ defaultBoard }: SmartSearchProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  const parseSearchQuery = (searchQuery: string): {
    board: 'CBSE' | 'ICSE';
    subject?: string;
    classNum?: number;
    contentType?: string;
  } | null => {
    const lower = searchQuery.toLowerCase().trim();
    
    // Detect board
    let board: 'CBSE' | 'ICSE' = defaultBoard;
    if (lower.includes('cbse')) board = 'CBSE';
    if (lower.includes('icse')) board = 'ICSE';

    // Detect class (7-12)
    const classMatch = lower.match(/\b(class\s*)?(\d{1,2})(th|st|nd|rd)?\b/);
    const classNum = classMatch ? parseInt(classMatch[2]) : undefined;
    if (classNum && (classNum < 7 || classNum > 12)) {
      return null;
    }

    // Detect subject
    let subject: string | undefined;
    if (lower.includes('physics') || lower.includes('phy')) subject = 'Physics';
    else if (lower.includes('chemistry') || lower.includes('chem')) subject = 'Chemistry';
    else if (lower.includes('biology') || lower.includes('bio')) subject = 'Biology';

    // Detect content type
    let contentType: string | undefined;
    if (lower.includes('mcq') || lower.includes('multiple choice')) contentType = 'mcq';
    else if (lower.includes('long') || lower.includes('notes') || lower.includes('answer')) contentType = 'long-answer';
    else if (lower.includes('hots') || lower.includes('important')) contentType = 'hots';

    if (!subject || !classNum) {
      return null;
    }

    return { board, subject, classNum, contentType };
  };

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: "Empty search",
        description: "Please enter a search query like 'Class 10 Physics MCQ'",
        variant: "destructive"
      });
      return;
    }

    const parsed = parseSearchQuery(query);
    
    if (!parsed || !parsed.subject || !parsed.classNum) {
      toast({
        title: "Could not understand query",
        description: "Try something like 'Class 10 Physics MCQ' or 'CBSE 12 Chemistry HOTS'",
        variant: "destructive"
      });
      return;
    }

    const { board, subject, classNum, contentType } = parsed;
    const url = `/browse/${board}/${subject}/${classNum}${contentType ? `?type=${contentType}` : ''}`;
    navigate(url);
    setQuery('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (query.trim().length > 2) {
      const lower = query.toLowerCase();
      const newSuggestions: string[] = [];
      
      // Generate smart suggestions
      const subjects = ['Physics', 'Chemistry', 'Biology'];
      const classes = [7, 8, 9, 10, 11, 12];
      const contentTypes = ['MCQ', 'Long Answer', 'HOTS'];
      
      subjects.forEach(subject => {
        if (subject.toLowerCase().includes(lower)) {
          classes.forEach(cls => {
            contentTypes.forEach(type => {
              newSuggestions.push(`Class ${cls} ${subject} ${type}`);
            });
          });
        }
      });

      // Limit suggestions
      setSuggestions(newSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    const parsed = parseSearchQuery(suggestion);
    if (parsed && parsed.subject && parsed.classNum) {
      const { board, subject, classNum, contentType } = parsed;
      const url = `/browse/${board}/${subject}/${classNum}${contentType ? `?type=${contentType}` : ''}`;
      navigate(url);
      setQuery('');
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search: e.g., 'Class 10 Physics MCQ' or 'CBSE 12 Chemistry HOTS'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 h-12 text-base"
          />
        </div>
        <Button onClick={handleSearch} size="lg" className="px-6">
          Search
        </Button>
      </div>
      
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-accent transition-colors text-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
