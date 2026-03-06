
// Types for our simulated blockchain storage
export type StoredFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  encryptedData: string;
  dateAdded: string;
  blockchainReference: string; // Simulated blockchain address
  thumbnailUrl?: string;
};

// Simulated blockchain storage using localStorage
export class BlockchainStorage {
  private userId: string;
  private storageKey: string;

  constructor(userId: string) {
    this.userId = userId;
    this.storageKey = `vaultify-storage-${userId}`;
  }

  // Get all files for the current user
  getFiles(): StoredFile[] {
    const storedData = localStorage.getItem(this.storageKey);
    if (!storedData) return [];
    
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error retrieving files:', error);
      return [];
    }
  }

  // Add a new file to storage
  addFile(file: Omit<StoredFile, 'id' | 'dateAdded' | 'blockchainReference'>): StoredFile {
    const files = this.getFiles();
    
    // Generate a random blockchain-like address
    const blockchainReference = '0x' + Array(40).fill('').map(() => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    const newFile: StoredFile = {
      ...file,
      id: Math.random().toString(36).substring(2, 15),
      dateAdded: new Date().toISOString(),
      blockchainReference
    };
    
    files.push(newFile);
    localStorage.setItem(this.storageKey, JSON.stringify(files));
    
    // Simulate network delay for blockchain transaction
    return this.simulateBlockchainDelay(newFile);
  }

  // Remove a file from storage
  removeFile(fileId: string): boolean {
    const files = this.getFiles();
    const newFiles = files.filter(file => file.id !== fileId);
    
    if (newFiles.length === files.length) {
      return false; // File not found
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(newFiles));
    return true;
  }

  // Get a specific file by ID
  getFile(fileId: string): StoredFile | null {
    const files = this.getFiles();
    const file = files.find(f => f.id === fileId);
    return file || null;
  }

  // Simulate blockchain processing delay
  private simulateBlockchainDelay<T>(data: T): T {
    // In a real app, we'd handle asynchronous blockchain operations
    // For now, we just return the data directly
    return data;
  }

  // Clear all storage for this user
  clearStorage(): void {
    localStorage.removeItem(this.storageKey);
  }
}

// Helper function to get stored files from the blockchain storage
export const getStoredFiles = (): Promise<StoredFile[]> => {
  return new Promise((resolve) => {
    // Get the user ID from localStorage
    const storedUser = localStorage.getItem('vaultify-user');
    let userId = 'default-user';
    
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        userId = userObj.id || 'default-user';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Initialize blockchain storage with user ID
    const storage = new BlockchainStorage(userId);
    
    // Get files from storage
    const files = storage.getFiles();
    
    // Add a small delay to simulate network request
    setTimeout(() => {
      resolve(files);
    }, 500);
  });
};

// Helper function to store a file in the blockchain storage
export const storeFile = (fileData: Omit<StoredFile, 'id' | 'dateAdded' | 'blockchainReference'>): Promise<StoredFile> => {
  return new Promise((resolve) => {
    // Get the user ID from localStorage
    const storedUser = localStorage.getItem('vaultify-user');
    let userId = 'default-user';
    
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        userId = userObj.id || 'default-user';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Initialize blockchain storage with user ID
    const storage = new BlockchainStorage(userId);
    
    // Add file to storage
    const storedFile = storage.addFile(fileData);
    
    // Add a small delay to simulate blockchain transaction
    setTimeout(() => {
      resolve(storedFile);
    }, 1000);
  });
};

// Helper function to delete a file from the blockchain storage
export const deleteFile = (fileId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Get the user ID from localStorage
    const storedUser = localStorage.getItem('vaultify-user');
    let userId = 'default-user';
    
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        userId = userObj.id || 'default-user';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Initialize blockchain storage with user ID
    const storage = new BlockchainStorage(userId);
    
    // Remove file from storage
    const success = storage.removeFile(fileId);
    
    // Add a small delay to simulate blockchain transaction
    setTimeout(() => {
      resolve(success);
    }, 800);
  });
};

// Helper function to convert file size to human-readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to read a file as text
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// Helper function to read a file as data URL (for images)
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
