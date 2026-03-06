
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Key } from 'lucide-react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: 'Username Required',
        description: 'Please enter a username to continue.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      try {
        // Call the login function from UserContext
        login(username);
        
        // Show success message
        toast({
          title: 'Welcome!',
          description: `You've successfully logged in as ${username}. Please set up your encryption key in the profile section.`,
        });
        
        // Navigate to dashboard
        navigate('/dashboard');
      } catch (error) {
        toast({
          title: 'Login Failed',
          description: 'An error occurred during login.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }, 800); // Simulate network delay
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter a username to access your encrypted files
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="h-11"
            />
          </div>
          <div className="bg-primary/10 rounded-lg p-3 flex items-start text-sm text-primary-foreground">
            <Key className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-primary" />
            <p>
              After logging in, you'll need to set up an encryption key in your profile
              to secure your files.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full h-11"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
