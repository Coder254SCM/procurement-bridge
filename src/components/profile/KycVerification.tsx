
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Profile } from '@/types/database.types';
import { KycStatus } from '@/types/enums';
import DocumentUploader from './DocumentUploader';

interface KycVerificationProps {
  profile: Profile | null;
  uploading: boolean;
  loading: boolean;
  handleDocumentUpload: (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => void;
  handleSubmitVerification: () => void;
  hasDocument: (documentType: string) => boolean;
  getDocumentStatus: (documentType: string) => string;
}

const KycVerification = ({
  profile,
  uploading,
  loading,
  handleDocumentUpload,
  handleSubmitVerification,
  hasDocument,
  getDocumentStatus
}: KycVerificationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Verification</CardTitle>
        <CardDescription>
          Complete verification to access all features of the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Verification Status</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              profile?.verified 
                ? "bg-green-100 text-green-800" 
                : profile?.kyc_status === KycStatus.UNDER_REVIEW
                  ? "bg-blue-100 text-blue-800"
                  : profile?.kyc_status === KycStatus.SUBMITTED
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-800"
            }`}>
              {profile?.verified 
                ? "Verified" 
                : profile?.kyc_status === KycStatus.UNDER_REVIEW
                  ? "Under Review"
                  : profile?.kyc_status === KycStatus.SUBMITTED
                    ? "Submitted"
                    : "Pending Verification"}
            </div>
          </div>
          <p className="text-muted-foreground">
            {profile?.verified 
              ? "Your account has been fully verified." 
              : profile?.kyc_status === KycStatus.UNDER_REVIEW
                ? "Your documents are being reviewed by our team."
                : profile?.kyc_status === KycStatus.SUBMITTED
                  ? "Your documents have been submitted. Please submit for verification when all required documents are uploaded."
                  : "Your account is pending verification. Complete the required steps below."}
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Required Documents</h3>
          
          <DocumentUploader
            documentType="business_registration"
            title="Business Registration Certificate"
            description="Upload an official business registration document"
            profile={profile}
            uploading={uploading}
            handleDocumentUpload={handleDocumentUpload}
            hasDocument={hasDocument}
            getDocumentStatus={getDocumentStatus}
          />
          
          <DocumentUploader
            documentType="tax_compliance"
            title="Tax Compliance Certificate"
            description="Upload a valid tax compliance certificate"
            profile={profile}
            uploading={uploading}
            handleDocumentUpload={handleDocumentUpload}
            hasDocument={hasDocument}
            getDocumentStatus={getDocumentStatus}
          />
          
          <DocumentUploader
            documentType="director_id"
            title="Director ID/Passport"
            description="Upload a valid identification document for the company director"
            profile={profile}
            uploading={uploading}
            handleDocumentUpload={handleDocumentUpload}
            hasDocument={hasDocument}
            getDocumentStatus={getDocumentStatus}
          />

          <DocumentUploader
            documentType="blockchain_consent"
            title="Blockchain Data Consent Form"
            description="Upload the signed consent form for storing verification hashes on blockchain"
            profile={profile}
            uploading={uploading}
            handleDocumentUpload={handleDocumentUpload}
            hasDocument={hasDocument}
            getDocumentStatus={getDocumentStatus}
          />
        </div>
      </CardContent>
      {!profile?.verified && profile?.kyc_status !== KycStatus.UNDER_REVIEW && (
        <CardFooter>
          <Button 
            onClick={handleSubmitVerification} 
            disabled={loading || 
                      !hasDocument('business_registration') || 
                      !hasDocument('tax_compliance') || 
                      !hasDocument('director_id')}
          >
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default KycVerification;
