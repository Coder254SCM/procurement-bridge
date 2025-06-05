
import { supabase } from '@/integrations/supabase/client';

export interface DocumentUploadOptions {
  bucket: string;
  folder: string;
  allowedTypes?: string[];
  maxSize?: number; // in bytes
}

export interface UploadedDocument {
  id: string;
  name: string;
  path: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string;
}

export class DocumentStorageService {
  private static instance: DocumentStorageService;

  public static getInstance(): DocumentStorageService {
    if (!DocumentStorageService.instance) {
      DocumentStorageService.instance = new DocumentStorageService();
    }
    return DocumentStorageService.instance;
  }

  async uploadDocument(
    file: File,
    options: DocumentUploadOptions
  ): Promise<UploadedDocument> {
    try {
      // Validate file type
      if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not allowed`);
      }

      // Validate file size
      if (options.maxSize && file.size > options.maxSize) {
        throw new Error(`File size exceeds maximum of ${options.maxSize} bytes`);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${options.folder}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(fileName);

      return {
        id: data.path,
        name: file.name,
        path: data.path,
        url: urlData.publicUrl,
        type: file.type,
        size: file.size,
        uploaded_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Document upload error:', error);
      throw error;
    }
  }

  async deleteDocument(bucket: string, path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Document delete error:', error);
      throw error;
    }
  }

  async getDocumentUrl(bucket: string, path: string): Promise<string> {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return data.publicUrl;
    } catch (error) {
      console.error('Get document URL error:', error);
      throw error;
    }
  }

  async listDocuments(bucket: string, folder: string): Promise<UploadedDocument[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder);

      if (error) throw error;

      return data.map(file => ({
        id: file.name,
        name: file.name,
        path: `${folder}/${file.name}`,
        url: this.getDocumentUrl(bucket, `${folder}/${file.name}`),
        type: file.metadata?.mimetype || 'unknown',
        size: file.metadata?.size || 0,
        uploaded_at: file.created_at || new Date().toISOString()
      })) as UploadedDocument[];
    } catch (error) {
      console.error('List documents error:', error);
      throw error;
    }
  }
}

export const documentStorage = DocumentStorageService.getInstance();
