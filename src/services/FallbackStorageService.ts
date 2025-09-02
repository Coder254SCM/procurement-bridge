import { supabase } from '@/integrations/supabase/client';

// Open source fallback storage using local storage and IndexedDB
class FallbackStorageService {
  private static instance: FallbackStorageService;
  private dbName = 'ProcurementStorage';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  public static getInstance(): FallbackStorageService {
    if (!FallbackStorageService.instance) {
      FallbackStorageService.instance = new FallbackStorageService();
    }
    return FallbackStorageService.instance;
  }

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('documents')) {
          const docStore = db.createObjectStore('documents', { keyPath: 'id' });
          docStore.createIndex('bucket', 'bucket', { unique: false });
          docStore.createIndex('userId', 'userId', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('images')) {
          const imgStore = db.createObjectStore('images', { keyPath: 'id' });
          imgStore.createIndex('bucket', 'bucket', { unique: false });
        }
      };
    });
  }

  async uploadFile(
    bucket: string,
    fileName: string,
    file: File,
    metadata?: Record<string, any>
  ): Promise<{ data: any; error: any }> {
    try {
      // Try Supabase first
      const { data: supabaseData, error: supabaseError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (!supabaseError) {
        return { data: supabaseData, error: null };
      }

      // Fallback to IndexedDB
      console.warn('Supabase storage failed, using fallback:', supabaseError);
      
      if (!this.db) {
        await this.initDB();
      }

      const fileData = {
        id: `${bucket}/${fileName}`,
        bucket,
        fileName,
        file: await this.fileToBase64(file),
        contentType: file.type,
        size: file.size,
        userId: await this.getCurrentUserId(),
        uploadedAt: new Date().toISOString(),
        metadata: metadata || {}
      };

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['documents'], 'readwrite');
        const store = transaction.objectStore('documents');
        const request = store.put(fileData);

        request.onsuccess = () => {
          resolve({
            data: {
              path: fileData.id,
              id: fileData.id,
              fullPath: fileData.id
            },
            error: null
          });
        };

        request.onerror = () => {
          reject({ data: null, error: request.error });
        };
      });

    } catch (error) {
      return { data: null, error };
    }
  }

  async downloadFile(bucket: string, fileName: string): Promise<{ data: Blob | null; error: any }> {
    try {
      // Try Supabase first
      const { data: supabaseData, error: supabaseError } = await supabase.storage
        .from(bucket)
        .download(fileName);

      if (!supabaseError) {
        return { data: supabaseData, error: null };
      }

      // Fallback to IndexedDB
      if (!this.db) {
        await this.initDB();
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['documents'], 'readonly');
        const store = transaction.objectStore('documents');
        const request = store.get(`${bucket}/${fileName}`);

        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            const blob = this.base64ToBlob(result.file, result.contentType);
            resolve({ data: blob, error: null });
          } else {
            resolve({ data: null, error: new Error('File not found') });
          }
        };

        request.onerror = () => {
          reject({ data: null, error: request.error });
        };
      });

    } catch (error) {
      return { data: null, error };
    }
  }

  async deleteFile(bucket: string, fileName: string): Promise<{ data: any; error: any }> {
    try {
      // Try Supabase first
      const { data: supabaseData, error: supabaseError } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (!supabaseError) {
        return { data: supabaseData, error: null };
      }

      // Fallback to IndexedDB
      if (!this.db) {
        await this.initDB();
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['documents'], 'readwrite');
        const store = transaction.objectStore('documents');
        const request = store.delete(`${bucket}/${fileName}`);

        request.onsuccess = () => {
          resolve({ data: { message: 'File deleted successfully' }, error: null });
        };

        request.onerror = () => {
          reject({ data: null, error: request.error });
        };
      });

    } catch (error) {
      return { data: null, error };
    }
  }

  async listFiles(bucket: string): Promise<{ data: any[] | null; error: any }> {
    try {
      // Try Supabase first
      const { data: supabaseData, error: supabaseError } = await supabase.storage
        .from(bucket)
        .list();

      if (!supabaseError) {
        return { data: supabaseData, error: null };
      }

      // Fallback to IndexedDB
      if (!this.db) {
        await this.initDB();
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['documents'], 'readonly');
        const store = transaction.objectStore('documents');
        const index = store.index('bucket');
        const request = index.getAll(bucket);

        request.onsuccess = () => {
          const files = request.result.map(file => ({
            name: file.fileName,
            id: file.id,
            updated_at: file.uploadedAt,
            created_at: file.uploadedAt,
            last_accessed_at: file.uploadedAt,
            metadata: file.metadata
          }));
          resolve({ data: files, error: null });
        };

        request.onerror = () => {
          reject({ data: null, error: request.error });
        };
      });

    } catch (error) {
      return { data: null, error };
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  private async getCurrentUserId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  }

  // Sync fallback data to Supabase when connection is restored
  async syncToSupabase(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }

    const transaction = this.db!.transaction(['documents'], 'readonly');
    const store = transaction.objectStore('documents');
    const request = store.getAll();

    request.onsuccess = async () => {
      const fallbackFiles = request.result;
      
      for (const fileData of fallbackFiles) {
        try {
          // Convert base64 back to file
          const blob = this.base64ToBlob(fileData.file, fileData.contentType);
          const file = new File([blob], fileData.fileName, { type: fileData.contentType });
          
          // Try to upload to Supabase
          const { error } = await supabase.storage
            .from(fileData.bucket)
            .upload(fileData.fileName, file);

          if (!error) {
            // Remove from fallback storage after successful sync
            await this.deleteFromFallback(fileData.id);
          }
        } catch (error) {
          console.error('Sync failed for file:', fileData.fileName, error);
        }
      }
    };
  }

  private async deleteFromFallback(fileId: string): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(['documents'], 'readwrite');
    const store = transaction.objectStore('documents');
    store.delete(fileId);
  }
}

export const fallbackStorageService = FallbackStorageService.getInstance();