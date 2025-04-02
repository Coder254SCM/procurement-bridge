
import React from 'react';
import { FileText, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RequiredDocument } from '@/types/database.types';
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
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="p-2 mr-3 rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Required Documents from Suppliers</CardTitle>
              <CardDescription>
                Select which documents suppliers must submit according to Kenya procurement laws
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RequiredDocumentsList 
            documents={requiredDocuments} 
            editable={true}
            onToggleRequired={onToggleRequiredDocument}
          />
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <div className="p-2 mr-3 rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Supporting Documents</CardTitle>
                <CardDescription>
                  Upload documents to support this tender (specifications, drawings, etc.)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="document-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/10 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-primary" />
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
                <h3 className="text-sm font-medium mb-2">Uploaded Documents</h3>
                <ul className="space-y-2">
                  {documents.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-2 rounded-md bg-secondary/20">
                      <span className="text-sm truncate max-w-[250px]">{file.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <div className="p-2 mr-3 rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Contract Documents</CardTitle>
                <CardDescription>
                  Upload contract template or standard terms and conditions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="contract-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/10 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-primary" />
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
                <h3 className="text-sm font-medium mb-2">Contract Documents</h3>
                <ul className="space-y-2">
                  {contractDocuments.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-2 rounded-md bg-secondary/20">
                      <span className="text-sm truncate max-w-[250px]">{file.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeContractFile(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
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
