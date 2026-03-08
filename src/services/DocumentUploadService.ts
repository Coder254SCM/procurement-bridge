import { supabase } from '@/integrations/supabase/client';

export class DocumentUploadService {
  /**
   * Upload files to a Supabase storage bucket
   */
  static async uploadFiles(
    bucket: string,
    basePath: string,
    files: File[]
  ): Promise<{ path: string; name: string; size: number }[]> {
    const results: { path: string; name: string; size: number }[] = [];

    for (const file of files) {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${basePath}/${timestamp}_${safeName}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
      }

      results.push({
        path: filePath,
        name: file.name,
        size: file.size,
      });
    }

    return results;
  }

  /**
   * Upload tender documents (supporting docs + contract templates)
   */
  static async uploadTenderDocuments(
    tenderId: string,
    userId: string,
    supportingDocs: File[],
    contractDocs: File[]
  ): Promise<{ supporting: string[]; contract: string[] }> {
    const supporting: string[] = [];
    const contract: string[] = [];

    if (supportingDocs.length > 0) {
      const results = await this.uploadFiles(
        'tender-documents',
        `${userId}/${tenderId}/supporting`,
        supportingDocs
      );
      supporting.push(...results.map(r => r.path));
    }

    if (contractDocs.length > 0) {
      const results = await this.uploadFiles(
        'tender-documents',
        `${userId}/${tenderId}/contracts`,
        contractDocs
      );
      contract.push(...results.map(r => r.path));
    }

    return { supporting, contract };
  }

  /**
   * Get a signed URL for downloading a file
   */
  static async getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  }
}
