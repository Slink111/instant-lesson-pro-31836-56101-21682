import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap } from 'lucide-react';

const Auth = () => {
  const [nicknameInput, setNicknameInput] = useState('');
  const { nickname, setNickname } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (nickname) {
      navigate('/');
    }
  }, [nickname, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nicknameInput.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a nickname',
        variant: 'destructive',
      });
      return;
    }

    setNickname(nicknameInput.trim());
    toast({
      title: 'Welcome!',
      description: `Hello, ${nicknameInput.trim()}!`,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 animate-fade-in">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Topper Guide
            </CardTitle>
            <CardDescription>
              Enter your nickname to continue
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="Enter your nickname"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full hover-scale">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
