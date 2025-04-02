
import React from 'react';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RequiredDocument } from '@/components/tenders/RequiredDocumentsList';
import RequiredDocumentsList from '@/components/tenders/RequiredDocumentsList';

interface DocumentsUploadFormProps {
  requiredDocuments: RequiredDocument[];
  documents: File[];
  contractDocuments: File[];
  onToggleRequiredDocument: (docId: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContractDocumentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  removeContractFile: (index: number) => void;
}

const DocumentsUploadForm = ({
  requiredDocuments,
  documents,
  contractDocuments,
  onToggleRequiredDocument,
  onFileChange,
  onContractDocumentChange,
  removeFile,
  removeContractFile
}: DocumentsUploadFormProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Required Documents from Suppliers
          </CardTitle>
          <CardDescription>
            Select which documents suppliers must submit according to Kenya procurement laws
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequiredDocumentsList 
            documents={requiredDocuments} 
            editable={true}
            onToggleRequired={onToggleRequiredDocument}
          />
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Supporting Documents (Optional)
            </CardTitle>
            <CardDescription>
              Upload documents to support this tender (specifications, drawings, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="document-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-secondary/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, XLSX, JPG, PNG (MAX. 5MB each)
                    </p>
                  </div>
                  <input
                    id="document-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={onFileChange}
                  />
                </label>
              </div>
            </div>
            
            {documents.length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-medium">Attached Documents</h3>
                <ul className="space-y-2">
                  {documents.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                      <span className="text-sm truncate max-w-[250px]">{file.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Contract Documents
            </CardTitle>
            <CardDescription>
              Upload contract template or standard terms and conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="contract-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-secondary/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold">Upload contract template</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF or DOCX (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    id="contract-upload"
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={onContractDocumentChange}
                  />
                </label>
              </div>
            </div>
            
            {contractDocuments.length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-medium">Contract Documents</h3>
                <ul className="space-y-2">
                  {contractDocuments.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                      <span className="text-sm truncate max-w-[250px]">{file.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeContractFile(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentsUploadForm;
