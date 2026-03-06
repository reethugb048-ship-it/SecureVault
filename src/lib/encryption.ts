/**
 * Simulates the encryption of data using a key
 * In a real implementation, this would use proper cryptographic libraries
 */
export function encryptData(data: string, key: string): string {
  try {
    // Convert data to UTF-8 encoded string first to handle all characters
    const encodedData = unescape(encodeURIComponent(data));
    
    // Simple simulation of encryption - not secure!
    // In a real application, use a proper encryption library
    const encryptedData = encodedData
      .split('')
      .map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
      )
      .join('');
    
    // Use Base64 encoding that is safe for all character sets
    const result = btoa(encryptedData);
    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data. Please try again with a different file.');
  }
}

/**
 * Simulates the decryption of data using a key
 */
export function decryptData(encryptedData: string, key: string): string {
  try {
    // For binary files that come as data URLs, we need special handling
    if (encryptedData.startsWith('data:')) {
      // Just return the data URL as is - it will be handled in the component
      return encryptedData;
    }
    
    // Simple simulation of decryption - not secure!
    let data;
    try {
      data = atob(encryptedData);
    } catch (e) {
      console.error('Failed to decode base64:', e);
      // If atob fails, try direct decryption (could be plain text)
      data = encryptedData;
    }
    
    const decrypted = data
      .split('')
      .map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
      )
      .join('');
    
    try {
      // Try to convert back from UTF-8 to original string
      return decodeURIComponent(escape(decrypted));
    } catch (e) {
      console.error('Failed to decode URI component:', e);
      // If URI decoding fails, return the decrypted data as is
      return decrypted;
    }
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    throw new Error('Decryption failed. Please check your encryption key.');
  }
}

/**
 * Generates a random encryption key
 */
export function generateEncryptionKey(length: number = 64): string {
  // In a real app, use a cryptographically secure method
  return Array(length)
    .fill('')
    .map(() => Math.random().toString(36).charAt(2))
    .join('');
}

/**
 * Formats an encryption key for display
 */
export function formatKeyForDisplay(key: string): string {
  // Format as groups of 4 characters separated by spaces
  return key.match(/.{1,4}/g)?.join(' ') || key;
}
