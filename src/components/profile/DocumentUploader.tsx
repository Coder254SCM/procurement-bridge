
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { UploadCloud, Loader2 } from 'lucide-react';
import { Profile } from '@/types/database.types';
import { KycStatus } from '@/types/enums';

interface DocumentUploaderProps {
  documentType: string;
  title: string;
  description: string;
  profile: Profile | null;
  uploading: boolean;
  handleDocumentUpload: (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => void;
  hasDocument: (documentType: string) => boolean;
  getDocumentStatus: (documentType: string) => string;
}

const DocumentUploader = ({
  documentType,
  title,
  description,
  profile,
  uploading,
  handleDocumentUpload,
  hasDocument,
  getDocumentStatus
}: DocumentUploaderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <Checkbox 
          id={documentType} 
          checked={hasDocument(documentType)}
          disabled={true}
        />
        <div className="space-y-1">
          <Label htmlFor={documentType} className="font-medium">
            {title}
          </Label>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
          {(!profile?.verified && profile?.kyc_status !== KycStatus.UNDER_REVIEW) && (
            <div className="mt-1">
              <Label
                htmlFor={`${documentType}_upload`}
                className={`inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${
                  hasDocument(documentType) 
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                } cursor-pointer`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {hasDocument(documentType) ? 'Replace Document' : 'Upload Document'}
                  </>
                )}
              </Label>
              <input
                id={`${documentType}_upload`}
                type="file"
                className="sr-only"
                onChange={(e) => handleDocumentUpload(e, documentType)}
                disabled={uploading}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {hasDocument(documentType) && (
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {getDocumentStatus(documentType)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
