
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { CustomInput } from '@/components/ui/custom-input';
import { 
  Shield, 
  Upload, 
  File, 
  FileText, 
  Search,
  LogOut,
  FileDown
} from 'lucide-react';
import { getStoredFiles, StoredFile, deleteFile } from '@/lib/storage';
import FileCard from '@/components/FileCard';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to access the dashboard.',
        variant: 'destructive',
      });
      navigate('/');
    } else {
      loadFiles();
    }
  }, [isAuthenticated, navigate]);

  // Load files
  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const storedFiles = await getStoredFiles();
      setFiles(storedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your files.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete file handler
  const handleDeleteFile = async (fileId: string) => {
    try {
      const success = await deleteFile(fileId);
      
      if (success) {
        // Filter out the deleted file
        setFiles(files.filter(file => file.id !== fileId));
        
        toast({
          title: 'File Deleted',
          description: 'The file has been removed from storage.',
        });
      } else {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the file.',
        variant: 'destructive',
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  // Filter files based on search query
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Encrypted Files</h1>
            <p className="text-muted-foreground mt-1">
              Manage your secure blockchain-stored files
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto flex-wrap">
            <CustomInput
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-64"
              prefixIcon={<Search className="w-4 h-4" />}
            />
            <Button onClick={() => navigate('/upload')} className="whitespace-nowrap">
              <Upload className="w-4 h-4 mr-2" /> Upload File
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/decrypter')} 
              className="whitespace-nowrap"
            >
              <FileDown className="w-4 h-4 mr-2" /> File Decrypter
            </Button>
            <Button variant="outline" onClick={handleLogout} className="whitespace-nowrap">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">Loading files...</div>
        ) : filteredFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map(file => (
              <FileCard 
                key={file.id} 
                file={file} 
                onDelete={handleDeleteFile} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-card/50">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No files found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? "No files match your search query. Try a different search."
                : "You haven't uploaded any files yet. Get started by uploading your first file."}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/upload')}>
                <Upload className="w-4 h-4 mr-2" /> Upload Your First File
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
