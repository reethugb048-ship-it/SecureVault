
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Copy, Check, RefreshCw, Save } from 'lucide-react';
import { formatKeyForDisplay } from '@/lib/encryption';
import { toast } from '@/components/ui/use-toast';

const KeyGenerator = () => {
  const { user, generateKey, setEncryptionKey } = useUser();
  const [displayKey, setDisplayKey] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedKey, setSavedKey] = useState('');

  // Set the display key when the user's encryption key changes
  useEffect(() => {
    if (user?.encryptionKey) {
      setDisplayKey(formatKeyForDisplay(user.encryptionKey));
    } else {
      setDisplayKey('');
    }
  }, [user?.encryptionKey]);

  // Handle generate key button
  const handleGenerateKey = () => {
    const key = generateKey();
    toast({
      title: "Key Generated",
      description: "Keep this key safe! You'll need it to decrypt your files.",
    });
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    if (user?.encryptionKey) {
      navigator.clipboard.writeText(user.encryptionKey);
      setCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Your encryption key has been copied to clipboard.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle custom key input
  const handleCustomKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomKey(e.target.value);
  };

  // Handle setting a custom key
  const handleSetCustomKey = () => {
    if (customKey.length < 10) {
      toast({
        title: "Key Too Short",
        description: "Your encryption key should be at least 10 characters long for security.",
        variant: "destructive"
      });
      return;
    }
    
    setEncryptionKey(customKey);
    setCustomKey('');
    toast({
      title: "Custom Key Set",
      description: "Your custom encryption key has been set successfully.",
    });
  };

  // Handle saving the key
  const handleSaveKey = () => {
    setSavedKey(user?.encryptionKey || '');
    localStorage.setItem('saved-encryption-key', user?.encryptionKey || '');
    toast({
      title: "Key Saved Locally",
      description: "Your encryption key has been saved in local storage.",
    });
  };

  // Handle retrieving the saved key
  const handleLoadSavedKey = () => {
    const saved = localStorage.getItem('saved-encryption-key');
    if (saved) {
      setEncryptionKey(saved);
      toast({
        title: "Key Restored",
        description: "Your saved encryption key has been restored.",
      });
    } else {
      toast({
        title: "No Saved Key Found",
        description: "No previously saved encryption key was found in local storage.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 rounded-xl border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Key className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Encryption Key</h2>
      </div>
      
      {/* Current key display */}
      {displayKey ? (
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-2">Your current encryption key:</div>
          <div className="flex">
            <div className="flex-1 bg-secondary/70 p-3 rounded-l-md font-mono text-sm overflow-x-auto whitespace-nowrap">
              {displayKey}
            </div>
            <Button
              onClick={handleCopy}
              variant="secondary"
              className="rounded-l-none"
              title="Copy key to clipboard"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-3 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSaveKey}
              className="text-xs"
            >
              <Save className="h-3 w-3 mr-1" />
              Save Key Locally
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-secondary/40 rounded-md mb-6 text-center">
          <p className="text-muted-foreground">No encryption key set</p>
          <p className="text-xs mt-1">Generate a key or enter your own to start encrypting files</p>
        </div>
      )}
      
      {/* Actions */}
      <div className="space-y-5">
        {/* Generate new key */}
        <div>
          <div className="text-sm font-medium mb-2">Generate New Key</div>
          <Button 
            onClick={handleGenerateKey} 
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Random Key
          </Button>
          <p className="text-xs text-muted-foreground mt-1.5">
            This will create a secure random key for you
          </p>
        </div>
        
        {/* Enter custom key */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium mb-2">Enter Custom Key</div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your encryption key"
              value={customKey}
              onChange={handleCustomKeyChange}
              className="font-mono"
            />
            <Button 
              onClick={handleSetCustomKey}
              disabled={customKey.length < 10}
              variant="secondary"
            >
              Set Key
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Enter a key that you've previously used
          </p>
        </div>
        
        {/* Restore saved key */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium mb-2">Restore Saved Key</div>
          <Button 
            onClick={handleLoadSavedKey} 
            variant="outline"
            className="w-full"
          >
            <Key className="h-4 w-4 mr-2" />
            Load Saved Key
          </Button>
          <p className="text-xs text-muted-foreground mt-1.5">
            Restore your previously saved encryption key from local storage
          </p>
        </div>
      </div>
      
      {/* Warning */}
      <div className="mt-6 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
        <p className="font-medium">Important:</p>
        <p className="text-xs mt-1">
          Your encryption key is the only way to decrypt your files. If you lose it, 
          your data will be permanently inaccessible. Save it in a secure location.
        </p>
      </div>
    </div>
  );
};

export default KeyGenerator;
