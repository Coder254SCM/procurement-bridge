import React from 'react';
import { Shield, FileText, Database, Clock, AlertTriangle, CheckCircle, Lock, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DataProtection = () => {
  const lastUpdated = "December 6, 2025";

  const retentionSchedule = [
    { category: 'Tenders', retention: '7 Years', legalBasis: 'PPRA 2015 Section 67', purgeMethod: 'Archive' },
    { category: 'Bids', retention: '7 Years', legalBasis: 'PPRA 2015 Section 67', purgeMethod: 'Archive' },
    { category: 'Contracts', retention: '7 Years', legalBasis: 'PPRA 2015 Section 67', purgeMethod: 'Archive' },
    { category: 'Evaluations', retention: '7 Years', legalBasis: 'PPRA 2015 Section 67', purgeMethod: 'Archive' },
    { category: 'Audit Logs', retention: '10 Years', legalBasis: 'PPRA 2015 + Kenya Evidence Act', purgeMethod: 'Archive' },
    { category: 'Blockchain Records', retention: 'Permanent', legalBasis: 'Immutable by design', purgeMethod: 'N/A' },
    { category: 'User Profiles', retention: '7 Years', legalBasis: 'Kenya DPA 2019', purgeMethod: 'Anonymize' },
    { category: 'Notifications', retention: '2 Years', legalBasis: 'Internal policy', purgeMethod: 'Delete' },
    { category: 'Appeal Records', retention: '7 Years', legalBasis: 'PPRA 2015 Section 168', purgeMethod: 'Archive' },
    { category: 'AGPO Registrations', retention: '7 Years', legalBasis: 'PPRA AGPO Regulations', purgeMethod: 'Archive' },
  ];

  const securityMeasures = [
    { measure: 'Encryption at Rest', status: 'implemented', provider: 'Supabase (AES-256)' },
    { measure: 'Encryption in Transit', status: 'implemented', provider: 'TLS 1.3' },
    { measure: 'Role-Based Access Control', status: 'implemented', provider: 'Custom (12 roles)' },
    { measure: 'Row-Level Security', status: 'implemented', provider: 'Supabase RLS' },
    { measure: 'SQL Injection Protection', status: 'implemented', provider: 'Parameterized queries' },
    { measure: 'XSS Protection', status: 'implemented', provider: 'Input sanitization' },
    { measure: 'CSRF Protection', status: 'implemented', provider: 'Token-based' },
    { measure: 'Rate Limiting', status: 'implemented', provider: 'Per-tier API limits' },
    { measure: 'Audit Logging', status: 'implemented', provider: 'Custom + Supabase' },
    { measure: 'Blockchain Audit Trail', status: 'implemented', provider: 'Hyperledger Fabric' },
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Data Protection Policy</h1>
            <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="bg-primary/10 border-l-4 border-l-primary p-6 rounded-lg my-6">
          <p className="font-semibold mb-2">Compliance Framework</p>
          <p className="text-sm">
            This policy ensures compliance with Kenya Data Protection Act 2019, Public Procurement and Asset Disposal Act 2015 (PPRA), 
            EU General Data Protection Regulation (GDPR), and international best practices for procurement data management.
          </p>
        </div>

        {/* Legal Framework */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <Scale className="h-6 w-6" />
            1. Legal Framework
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kenya Laws</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• <strong>Data Protection Act 2019</strong> - Personal data processing</p>
                <p>• <strong>PPRA 2015</strong> - Procurement records retention (Section 67)</p>
                <p>• <strong>Evidence Act Cap 80</strong> - Document admissibility</p>
                <p>• <strong>Companies Act 2015</strong> - Corporate records</p>
                <p>• <strong>Income Tax Act</strong> - Financial records (7 years)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">International Standards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• <strong>GDPR</strong> - EU data protection (for EU users)</p>
                <p>• <strong>UNCITRAL Model Law</strong> - Electronic commerce</p>
                <p>• <strong>WTO GPA</strong> - Procurement transparency</p>
                <p>• <strong>ISO 27001</strong> - Information security (guidance)</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Data Retention Schedule */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <Clock className="h-6 w-6" />
            2. Data Retention Schedule
          </h2>
          
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data Category</TableHead>
                    <TableHead>Retention Period</TableHead>
                    <TableHead>Legal Basis</TableHead>
                    <TableHead>Disposal Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retentionSchedule.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>
                        <Badge variant={item.retention === 'Permanent' ? 'secondary' : 'outline'}>
                          {item.retention}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.legalBasis}</TableCell>
                      <TableCell>{item.purgeMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-l-yellow-500 p-4 rounded-lg mt-4">
            <p className="font-semibold text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Important Note on 7-Year Retention
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
              Per PPRA 2015 Section 67, all procurement records must be retained for a minimum of 7 years from the date 
              of contract completion or termination. This includes tenders, bids, evaluations, contracts, and related correspondence. 
              Records may be retained longer for ongoing disputes or audits.
            </p>
          </div>
        </section>

        {/* Security Measures */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <Lock className="h-6 w-6" />
            3. Security Measures Implemented
          </h2>
          
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Security Measure</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Implementation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityMeasures.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.measure}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Implemented
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.provider}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Blockchain Transparency */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <Database className="h-6 w-6" />
            4. Blockchain & Transparency
          </h2>
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">What is Recorded on Blockchain</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Cryptographic hashes (SHA-256) of tender documents</li>
                  <li>• Bid submission timestamps and verification</li>
                  <li>• Evaluation completion records</li>
                  <li>• Contract award notifications</li>
                  <li>• Document integrity verification</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">What is NOT on Blockchain</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Personal identifiable information (PII)</li>
                  <li>• Actual document contents</li>
                  <li>• Financial account details</li>
                  <li>• Passwords or authentication tokens</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Hyperledger Fabric vs Public Blockchain</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  We use Hyperledger Fabric, a <strong>private/permissioned blockchain</strong>, not a public blockchain like Ethereum or Polygon. 
                  This means records are NOT viewable on public explorers like Etherscan or Polygonscan. 
                  Verification is done through our secure platform interface, ensuring both transparency and privacy.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* AGPO Data Handling */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <FileText className="h-6 w-6" />
            5. AGPO & Special Category Data
          </h2>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm mb-4">
                Access to Government Procurement Opportunities (AGPO) data requires special handling as it may reveal 
                protected characteristics (age for Youth, gender for Women, disability status for PWDs).
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Data We Collect</h4>
                  <ul className="text-sm space-y-1">
                    <li>• AGPO certificate number</li>
                    <li>• Certificate category (Youth/Women/PWD)</li>
                    <li>• Certificate expiry date</li>
                    <li>• Verification status</li>
                  </ul>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Protections Applied</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Access restricted to procurement staff</li>
                    <li>• Used only for preference calculation</li>
                    <li>• Not shared with third parties</li>
                    <li>• Anonymized in aggregate reports</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data Subject Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. Exercising Your Rights</h2>
          
          <p className="mb-4">
            To exercise any of your data protection rights (access, rectification, erasure, portability), 
            please contact our Data Protection Officer:
          </p>
          
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                  <p className="text-sm text-muted-foreground">
                    ProcureChain Kenya Limited<br />
                    Email: dpo@procurechain.co.ke<br />
                    Phone: +254 (0) 20 123 4567<br />
                    Response Time: 30 days
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Regulatory Authority</h4>
                  <p className="text-sm text-muted-foreground">
                    Office of the Data Protection Commissioner<br />
                    Website: www.odpc.go.ke<br />
                    Email: info@odpc.go.ke<br />
                    Phone: +254 (0) 20 2912 230
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Related Policies: <a href="/privacy" className="text-primary underline">Privacy Policy</a> | 
            <a href="/terms" className="text-primary underline ml-2">Terms of Service</a> | 
            <a href="/cookies" className="text-primary underline ml-2">Cookie Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataProtection;
