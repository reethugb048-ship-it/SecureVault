
import { useState } from 'react';
import { StoredFile, formatFileSize } from '@/lib/storage';
import { decryptData } from '@/lib/encryption';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { 
  File, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Lock, 
  FileText,
  Image,
  FileArchive,
  FileCode
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type FileCardProps = {
  file: StoredFile;
  onDelete: (fileId: string) => void;
};

const FileCard = ({ file, onDelete }: FileCardProps) => {
  const { user } = useUser();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);

  // Function to get appropriate icon based on file type
  const getFileIcon = () => {
    const type = file.type.split('/')[0];
    const subtype = file.type.split('/')[1];
    
    switch (type) {
      case 'image':
        return <Image className="h-6 w-6" />;
      case 'application':
        if (subtype === 'pdf') return <FileText className="h-6 w-6" />;
        if (subtype === 'zip' || subtype === 'x-rar-compressed') return <FileArchive className="h-6 w-6" />;
        if (subtype === 'json' || subtype.includes('script')) return <FileCode className="h-6 w-6" />;
        return <File className="h-6 w-6" />;
      case 'text':
        return <FileText className="h-6 w-6" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  // Function to decrypt file content
  const decryptFile = () => {
    if (!user?.encryptionKey) {
      toast({
        title: "Encryption Key Required",
        description: "You need to set your encryption key to decrypt this file.",
        variant: "destructive"
      });
      return;
    }

    setIsDecrypting(true);
    
    try {
      const decrypted = decryptData(file.encryptedData, user.encryptionKey);
      setDecryptedContent(decrypted);
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description: "Unable to decrypt the file. Please check your encryption key.",
        variant: "destructive"
      });
      console.error("Decryption error:", error);
    } finally {
      setIsDecrypting(false);
    }
  };

  // Function to hide decrypted content
  const hideDecryptedContent = () => {
    setDecryptedContent(null);
  };

  // Function to handle file download
  const handleDownload = () => {
    if (!decryptedContent) {
      toast({
        title: "Decrypt First",
        description: "Please decrypt the file before downloading",
      });
      return;
    }

    const element = document.createElement("a");
    const fileBlob = new Blob([decryptedContent], { type: file.type });
    element.href = URL.createObjectURL(fileBlob);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-5 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center">
            {getFileIcon()}
          </div>
          <div>
            <h3 className="font-medium text-base line-clamp-1" title={file.name}>
              {file.name}
            </h3>
            <div className="flex items-center text-xs text-muted-foreground gap-2">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>{new Date(file.dateAdded).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-1">
          {decryptedContent ? (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={hideDecryptedContent}
              title="Hide decrypted content"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={decryptFile}
              disabled={isDecrypting}
              title="Decrypt and view"
            >
              {isDecrypting ? 
                <span className="animate-pulse">...</span> : 
                <Eye className="h-4 w-4" />
              }
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDownload}
            disabled={!decryptedContent}
            title="Download decrypted file"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(file.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete file"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Blockchain reference */}
      <div className="flex items-center text-xs text-muted-foreground gap-1.5 mb-3">
        <Lock className="h-3 w-3" />
        <span className="font-mono truncate" title={file.blockchainReference}>
          {file.blockchainReference}
        </span>
      </div>
      
      {/* Decrypted content preview */}
      {decryptedContent && (
        <div className="mt-3 pt-3 border-t">
          <div className="text-xs text-muted-foreground mb-1">Decrypted content:</div>
          <div className="text-sm max-h-24 overflow-auto p-2 bg-secondary/50 rounded font-mono text-xs">
            {decryptedContent}
          </div>
          <div className="mt-2 flex justify-end">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleDownload}
              className="text-xs py-1 h-auto"
            >
              <Download className="h-3 w-3 mr-1" />
              Save Decrypted File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileCard;
