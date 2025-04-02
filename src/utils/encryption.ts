
/**
 * Utility for encrypting and decrypting sensitive data
 * Uses the Web Crypto API for client-side encryption/decryption
 */

// Generate a symmetric encryption key
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Convert CryptoKey to exportable format for storage
export async function exportKey(key: CryptoKey): Promise<string> {
  const exportedKey = await window.crypto.subtle.exportKey("raw", key);
  return arrayBufferToBase64(exportedKey);
}

// Import a previously exported key
export async function importKey(keyData: string): Promise<CryptoKey> {
  const rawKey = base64ToArrayBuffer(keyData);
  return await window.crypto.subtle.importKey(
    "raw",
    rawKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt data with the provided key
export async function encryptData(data: string, key: CryptoKey): Promise<string> {
  // Generate a random initialization vector for each encryption
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Convert the input data to an ArrayBuffer
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Encrypt the data
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    dataBuffer
  );
  
  // Combine the IV and encrypted data for storage
  const result = new Uint8Array(iv.length + new Uint8Array(encryptedBuffer).length);
  result.set(iv);
  result.set(new Uint8Array(encryptedBuffer), iv.length);
  
  // Convert to a Base64 string for storage
  return arrayBufferToBase64(result.buffer);
}

// Decrypt data with the provided key
export async function decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
  try {
    // Convert the Base64 string back to an ArrayBuffer
    const encryptedBuffer = base64ToArrayBuffer(encryptedData);
    
    // Extract the IV (first 12 bytes)
    const iv = encryptedBuffer.slice(0, 12);
    
    // Extract the encrypted data (everything after the IV)
    const dataBuffer = encryptedBuffer.slice(12);
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      dataBuffer
    );
    
    // Convert the decrypted ArrayBuffer back to a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data. The data may be corrupted or the key is incorrect.");
  }
}

// Helper function to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Encrypt sensitive fields in an object
export async function encryptSensitiveData<T extends Record<string, any>>(
  data: T, 
  sensitiveFields: (keyof T)[], 
  key: CryptoKey
): Promise<T> {
  const encryptedData = { ...data };
  
  for (const field of sensitiveFields) {
    if (encryptedData[field] && typeof encryptedData[field] === 'string') {
      encryptedData[field] = await encryptData(encryptedData[field] as string, key);
    }
  }
  
  return encryptedData;
}

// Decrypt sensitive fields in an object
export async function decryptSensitiveData<T extends Record<string, any>>(
  data: T, 
  sensitiveFields: (keyof T)[], 
  key: CryptoKey
): Promise<T> {
  const decryptedData = { ...data };
  
  for (const field of sensitiveFields) {
    if (decryptedData[field] && typeof decryptedData[field] === 'string') {
      try {
        decryptedData[field] = await decryptData(decryptedData[field] as string, key);
      } catch (error) {
        console.error(`Failed to decrypt field: ${String(field)}`, error);
      }
    }
  }
  
  return decryptedData;
}
