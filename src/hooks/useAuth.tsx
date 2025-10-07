import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  nickname: string | null;
  isAdmin: boolean;
  loading: boolean;
  setNickname: (nickname: string) => void;
  clearNickname: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_NICKNAME = 'tojodeepmaker111';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [nickname, setNicknameState] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('nickname');
    if (stored) {
      setNicknameState(stored);
      setIsAdmin(stored === ADMIN_NICKNAME);
    }
    setLoading(false);
  }, []);

  const setNickname = (newNickname: string) => {
    localStorage.setItem('nickname', newNickname);
    setNicknameState(newNickname);
    setIsAdmin(newNickname === ADMIN_NICKNAME);
  };

  const clearNickname = () => {
    localStorage.removeItem('nickname');
    setNicknameState(null);
    setIsAdmin(false);
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ nickname, isAdmin, loading, setNickname, clearNickname }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
