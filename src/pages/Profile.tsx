
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateEncryptionKey, formatKeyForDisplay } from '@/lib/encryption';
import { User, Key, Copy, RefreshCw, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Profile = () => {
  const { user, isAuthenticated, generateKey, setEncryptionKey } = useUser();
  const navigate = useNavigate();
  const [customKey, setCustomKey] = useState('');

  // Redirect if not logged in
  if (!isAuthenticated) {
    navigate('/');
    toast({
      title: 'Authentication Required',
      description: 'Please log in to access the profile page.',
      variant: 'destructive',
    });
    return null;
  }

  const handleGenerateKey = () => {
    const key = generateKey();
    toast({
      title: 'Encryption Key Generated',
      description: 'Your new encryption key has been generated and saved.',
    });
  };

  const handleSetCustomKey = () => {
    if (!customKey.trim()) {
      toast({
        title: 'Key Required',
        description: 'Please enter a custom encryption key.',
        variant: 'destructive',
      });
      return;
    }

    setEncryptionKey(customKey);
    setCustomKey('');
    toast({
      title: 'Custom Key Set',
      description: 'Your custom encryption key has been saved.',
    });
  };

  const handleCopyKey = () => {
    if (user?.encryptionKey) {
      navigator.clipboard.writeText(user.encryptionKey);
      toast({
        title: 'Key Copied',
        description: 'Your encryption key has been copied to clipboard.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-16 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <div className="space-y-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>User Information</CardTitle>
              </div>
              <CardDescription>
                Your basic account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Username</span>
                  <span className="font-medium">{user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account ID</span>
                  <span className="font-medium">{user?.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Encryption Key Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>Encryption Key</CardTitle>
              </div>
              <CardDescription>
                Your encryption key is used to secure your files. Make sure to save it somewhere safe as it cannot be recovered if lost.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.encryptionKey ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Key</span>
                    <Button variant="outline" size="sm" onClick={handleCopyKey}>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </div>
                  <div className="bg-muted p-3 rounded-md overflow-x-auto whitespace-nowrap font-mono text-sm">
                    {formatKeyForDisplay(user.encryptionKey)}
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4 flex">
                    <Shield className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <p className="text-sm">
                      This key is used to encrypt your files. Without it, you won't be able to decrypt your files. Keep it somewhere safe.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 p-4 rounded-md flex">
                  <Shield className="w-5 h-5 mr-3 flex-shrink-0" />
                  <p className="text-sm">
                    You haven't set an encryption key yet. Generate one or set a custom key to start using encrypted file storage.
                  </p>
                </div>
              )}
              
              <div className="pt-4 space-y-3">
                <Button 
                  onClick={handleGenerateKey} 
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Generate New Key
                </Button>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter custom key"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleSetCustomKey}>Set Key</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
