
import { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { FileDown, Upload as UploadIcon, ArrowLeft, File, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { decryptData } from '@/lib/encryption';

const Decrypter = () => {
  const { isAuthenticated, user } = useUser();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string>(user?.encryptionKey || '');
  const [isBinaryFile, setIsBinaryFile] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Check if file is likely a binary file (image, etc)
      const isLikelyBinary = /^image\/|^audio\/|^video\/|^application\//.test(file.type);
      setIsBinaryFile(isLikelyBinary);
      
      // Read the file content appropriately
      const reader = new FileReader();
      
      if (isLikelyBinary) {
        reader.onload = (event) => {
          if (event.target?.result) {
            try {
              // For binary files, read as ArrayBuffer and convert to Base64
              const result = event.target.result;
              if (typeof result === 'string') {
                setFileContent(result);
              } else {
                // Convert ArrayBuffer to Base64
                const bytes = new Uint8Array(result);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                setFileContent(btoa(binary));
              }
            } catch (err) {
              console.error("Error reading binary file:", err);
              toast({
                title: "File Reading Error",
                description: "Could not read the encrypted file.",
                variant: "destructive"
              });
            }
          }
        };
        reader.readAsDataURL(file); // This will encode binary data as base64 within a data URL
      } else {
        // For text files, read as text
        reader.onload = (event) => {
          if (event.target?.result) {
            setFileContent(event.target.result as string);
          }
        };
        reader.readAsText(file);
      }
    }
  };
  
  const handleDownload = () => {
    if (!fileContent) {
      toast({
        title: "No Content Available",
        description: "Please upload a file first.",
        variant: "destructive"
      });
      return;
    }
    
    if (!encryptionKey) {
      toast({
        title: "Encryption Key Required",
        description: "Please enter your encryption key to decrypt the file.",
        variant: "destructive"
      });
      return;
    }
    
    setIsDecrypting(true);
    
    try {
      let decryptedContent: string;
      let blob: Blob;
      let downloadName: string;
      
      if (isBinaryFile && fileContent.startsWith('data:')) {
        // Handle binary file (image, etc.)
        // Extract the base64 content and mime type from the data URL
        const matches = fileContent.match(/^data:([^;]+);base64,(.+)$/);
        
        if (!matches || matches.length !== 3) {
          throw new Error("Invalid data URL format");
        }
        
        const mimeType = matches[1];
        const base64Data = matches[2];
        
        // Create a blob directly from the data URL
        const response = fetch(fileContent);
        blob = new Blob([base64Data], { type: mimeType });
        downloadName = selectedFile ? selectedFile.name.replace('.encrypted', '') : 'decrypted-file';
      } else {
        // Handle text file
        try {
          decryptedContent = decryptData(fileContent, encryptionKey);
          
          // If decryption returned a data URL (for images etc.)
          if (decryptedContent.startsWith('data:')) {
            const response = fetch(decryptedContent);
            blob = new Blob([decryptedContent], { type: 'text/plain' });
          } else {
            blob = new Blob([decryptedContent], { type: 'text/plain' });
          }
          
          downloadName = selectedFile ? selectedFile.name.replace('.encrypted', '') : 'decrypted-file.txt';
        } catch (error) {
          console.error("Decryption error:", error);
          throw new Error("Failed to decrypt the file. Check your encryption key and try again.");
        }
      }
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "File Downloaded",
        description: "Your file has been decrypted and downloaded successfully.",
      });
    } catch (error) {
      console.error("Decryption error:", error);
      toast({
        title: "Decryption Failed",
        description: error instanceof Error ? error.message : "Could not decrypt the file. Check your encryption key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsDecrypting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">File Decrypter</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Upload an encrypted file and enter your encryption key to decrypt and download it.
        </p>
        
        <div className="bg-card border rounded-xl p-8 mb-6">
          {!selectedFile ? (
            <div 
              className="border-2 border-dashed border-muted rounded-lg p-12 text-center cursor-pointer hover:bg-muted/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select an encrypted file</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Upload a file that has been encrypted, and we'll help you decrypt it.
              </p>
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-secondary/50 rounded-lg">
                <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center mr-4">
                  <File className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{selectedFile.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedFile(null);
                    setFileContent(null);
                  }}
                >
                  Change
                </Button>
              </div>
              
              {fileContent && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="encryption-key" className="text-sm font-medium">
                      Encryption Key
                    </label>
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-muted-foreground" />
                      <Input
                        id="encryption-key"
                        value={encryptionKey}
                        onChange={(e) => setEncryptionKey(e.target.value)}
                        placeholder="Enter your encryption key to decrypt"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                  
                  {!isBinaryFile && (
                    <div className="p-4 bg-secondary/30 rounded-lg max-h-60 overflow-y-auto">
                      <div className="text-sm font-mono break-all">
                        {fileContent.length > 500 
                          ? `${fileContent.substring(0, 500)}...` 
                          : fileContent}
                      </div>
                    </div>
                  )}
                  
                  {isBinaryFile && (
                    <div className="p-4 bg-secondary/30 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">
                        {selectedFile.type.startsWith('image/') ? 'Image file' : 'Binary file'} detected. 
                        Click the download button to decrypt and save.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleDownload} 
                      disabled={isDecrypting}
                    >
                      <FileDown className="w-4 h-4 mr-2" /> 
                      {isDecrypting ? 'Decrypting...' : 'Decrypt & Download'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Decrypter;
