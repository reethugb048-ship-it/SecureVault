import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Shield, Upload as UploadIcon, ArrowLeft, File, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { encryptData } from '@/lib/encryption';
import { storeFile, readFileAsText } from '@/lib/storage';
import Navbar from '@/components/Navbar';

const Upload = () => {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload files.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    if (!user?.encryptionKey) {
      toast({
        title: "Encryption Key Required",
        description: "You need to set up your encryption key before uploading files.",
        variant: "destructive"
      });
      navigate('/profile');
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user?.encryptionKey) {
      toast({
        title: "Encryption Key Required",
        description: "You need to set your encryption key before uploading files.",
        variant: "destructive"
      });
      navigate('/profile');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      const fileContent = await readFileAsText(selectedFile);
      
      const encryptedData = encryptData(fileContent, user.encryptionKey);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await storeFile({
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        encryptedData: encryptedData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Upload Successful",
        description: "Your file has been encrypted and stored securely.",
      });
      
      setTimeout(() => navigate('/dashboard'), 1500);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Upload & Encrypt File</h1>
        <p className="text-muted-foreground mb-8">
          Your file will be encrypted using your personal key before being stored on the blockchain
        </p>
        
        <div className="bg-card border rounded-xl p-8 mb-6">
          {!selectedFile ? (
            <div 
              className="border-2 border-dashed border-muted rounded-lg p-12 text-center cursor-pointer hover:bg-muted/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a file to upload</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Click to browse your files, or drag and drop a file here to encrypt and upload it securely.
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
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                >
                  Change
                </Button>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress < 100 ? 'Encrypting and uploading...' : 'Upload complete!'}
                  </p>
                </div>
              )}
              
              {!isUploading && (
                <div className="bg-primary/10 rounded-lg p-4 flex">
                  <AlertCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  <p className="text-sm">
                    This file will be encrypted with your personal key before uploading. 
                    Only you will be able to decrypt it using your key.
                  </p>
                </div>
              )}
              
              {!isUploading && (
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedFile(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpload}
                  >
                    <UploadIcon className="w-4 h-4 mr-2" /> Upload & Encrypt
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Upload;
