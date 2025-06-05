
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, File, Trash2, Download, Eye } from 'lucide-react';
import { documentStorage, UploadedDocument } from '@/services/DocumentStorageService';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploaderProps {
  folder: string;
  maxFiles?: number;
  maxSize?: number;
  allowedTypes?: string[];
  onDocumentsChange?: (documents: UploadedDocument[]) => void;
  existingDocuments?: UploadedDocument[];
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  folder,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  onDocumentsChange,
  existingDocuments = []
}) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>(existingDocuments);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (documents.length + acceptedFiles.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `Maximum ${maxFiles} files allowed`,
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    const newDocuments: UploadedDocument[] = [];

    for (const file of acceptedFiles) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        const uploadedDoc = await documentStorage.uploadDocument(file, {
          bucket: 'documents',
          folder,
          allowedTypes,
          maxSize
        });

        newDocuments.push(uploadedDoc);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        
        toast({
          title: 'Upload successful',
          description: `${file.name} uploaded successfully`
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive'
        });
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      }
    }

    const updatedDocuments = [...documents, ...newDocuments];
    setDocuments(updatedDocuments);
    onDocumentsChange?.(updatedDocuments);
    setUploading(false);
    setUploadProgress({});
  }, [documents, folder, maxFiles, maxSize, allowedTypes, onDocumentsChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    disabled: uploading || documents.length >= maxFiles
  });

  const removeDocument = async (documentToRemove: UploadedDocument) => {
    try {
      await documentStorage.deleteDocument('documents', documentToRemove.path);
      const updatedDocuments = documents.filter(doc => doc.id !== documentToRemove.id);
      setDocuments(updatedDocuments);
      onDocumentsChange?.(updatedDocuments);
      
      toast({
        title: 'Document removed',
        description: `${documentToRemove.name} has been removed`
      });
    } catch (error) {
      console.error('Remove document error:', error);
      toast({
        title: 'Remove failed',
        description: `Failed to remove ${documentToRemove.name}`,
        variant: 'destructive'
      });
    }
  };

  const downloadDocument = async (document: UploadedDocument) => {
    try {
      const url = await documentStorage.getDocumentUrl('documents', document.path);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: `Failed to download ${document.name}`,
        variant: 'destructive'
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeColor = (type: string) => {
    if (type.includes('pdf')) return 'bg-red-100 text-red-800';
    if (type.includes('image')) return 'bg-green-100 text-green-800';
    if (type.includes('word') || type.includes('document')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5" />
            Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading || documents.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium">Drop files here or click to browse</p>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, DOCX, DOC, JPG, PNG
                </p>
                <p className="text-sm text-gray-500">
                  Maximum file size: {formatFileSize(maxSize)}
                </p>
                <p className="text-sm text-gray-500">
                  {documents.length}/{maxFiles} files uploaded
                </p>
              </div>
            )}
          </div>

          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(uploadProgress).map(([filename, progress]) => (
                <div key={filename} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{filename}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <File className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{document.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{formatFileSize(document.size)}</span>
                        <Badge className={getFileTypeColor(document.type)}>
                          {document.type.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(document)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(document)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDocument(document)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUploader;
