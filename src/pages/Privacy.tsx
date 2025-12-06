import React from 'react';
import { Shield, AlertTriangle, Lock, Database, Globe, FileText, Users, Clock, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Privacy = () => {
  const lastUpdated = "December 6, 2025";

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="prose prose-lg max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Shield className="h-10 w-10 text-primary" />
          Privacy Policy
        </h1>
        <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>

        <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-l-blue-500 p-6 rounded-lg my-6">
          <p className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Your Privacy is Our Priority</p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            ProcureChain is committed to protecting your privacy and ensuring transparent data practices. 
            This comprehensive policy explains how we collect, use, protect, and manage your information in compliance 
            with Kenya Data Protection Act 2019, GDPR, and international standards.
          </p>
        </div>

        <p>
          ProcureChain Kenya Limited ("we," "our," or "us") operates the Kenya e-Government Procurement Platform. 
          This Privacy Policy explains in detail how we collect, use, disclose, and safeguard your information. 
          Please read this policy carefully. If you do not agree with these terms, please do not access or use the platform.
        </p>

        <h2 className="mt-8 text-2xl font-semibold flex items-center gap-2">
          <Database className="h-6 w-6" />
          1. Information We Collect
        </h2>
        
        <h3 className="mt-4 text-xl font-semibold">1.1 Information You Provide Directly</h3>
        <ul>
          <li>
            <strong>Account Registration Data:</strong> Full name, email address, phone number, organization name, 
            business registration number, physical address, Tax Identification Number (TIN/PIN), and password.
          </li>
          <li>
            <strong>Identity Verification Documents:</strong> National ID, passport, director IDs, business registration 
            certificates, tax compliance certificates, professional licenses, insurance certificates, and bank account details.
          </li>
          <li>
            <strong>Procurement Data:</strong> Tender specifications, bid submissions, technical proposals, financial proposals, 
            evaluation scores, contract terms, payment records, and performance metrics.
          </li>
          <li>
            <strong>AGPO Registration:</strong> Youth/Women/PWD certificates, AGPO certificate numbers, category registrations.
          </li>
          <li>
            <strong>Communication Data:</strong> Messages, inquiries, support tickets, clarification questions, appeals, and any other 
            correspondence with us or other platform users.
          </li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">1.2 Information Collected Automatically</h3>
        <ul>
          <li>
            <strong>Device and Usage Data:</strong> IP address, browser type and version, device identifiers, operating system, 
            screen resolution, language preferences, time zone settings, and referral URLs.
          </li>
          <li>
            <strong>Activity Logs:</strong> Pages visited, features used, time spent on pages, click patterns, search queries, 
            downloads, document views, and user interactions.
          </li>
          <li>
            <strong>Security Monitoring Data:</strong> Login attempts, IP addresses, geolocation data, device fingerprints, 
            and security event logs for fraud prevention and system protection.
          </li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">1.3 Information from Third Parties</h3>
        <ul>
          <li>
            <strong>Government Verification Services:</strong> Business registration status from Kenya Business Registration Service, 
            tax compliance status from Kenya Revenue Authority (KRA), and professional license verification from regulatory bodies.
          </li>
          <li>
            <strong>Payment Processors:</strong> Transaction confirmations, payment status, and billing information from M-Pesa, 
            Stripe, and other payment gateways.
          </li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold flex items-center gap-2">
          <Users className="h-6 w-6" />
          2. How We Use Your Information
        </h2>
        
        <h3 className="mt-4 text-xl font-semibold">2.1 Platform Operations and Service Delivery</h3>
        <ul>
          <li>Create, maintain, and manage user accounts and profiles</li>
          <li>Process tender publications, bid submissions, and contract awards</li>
          <li>Facilitate communication between buyers, suppliers, and evaluators</li>
          <li>Manage AGPO preferences and supplier categorization</li>
          <li>Process and track procurement appeals</li>
          <li>Provide customer support and respond to inquiries</li>
          <li>Manage subscriptions and process payments</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">2.2 Verification and Compliance</h3>
        <ul>
          <li>Verify user identity, business registration, and professional licenses</li>
          <li>Conduct Know Your Customer (KYC) and Anti-Money Laundering (AML) checks</li>
          <li>Assess supplier qualifications and AGPO eligibility</li>
          <li>Ensure compliance with Public Procurement and Asset Disposal Act 2015</li>
          <li>Monitor for fraudulent activities, bid rigging, and corruption</li>
          <li>Maintain audit trails for regulatory inspections</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">2.3 Legal Basis for Processing (GDPR & Kenya DPA 2019)</h3>
        <ul>
          <li><strong>Contract Performance:</strong> Processing necessary to fulfill our contractual obligations to you</li>
          <li><strong>Legal Obligation:</strong> Compliance with Kenya procurement laws (PPRA 2015), tax regulations, and AML requirements</li>
          <li><strong>Legitimate Interests:</strong> Fraud prevention, security monitoring, and platform improvement</li>
          <li><strong>Consent:</strong> Marketing communications and optional features (you can withdraw consent anytime)</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold flex items-center gap-2">
          <Lock className="h-6 w-6" />
          3. Data Security Measures
        </h2>
        
        <p>We implement industry-standard security measures to protect your data:</p>

        <h3 className="mt-4 text-xl font-semibold">3.1 Technical Security</h3>
        <ul>
          <li><strong>Encryption:</strong> TLS 1.3 for data in transit; AES-256 encryption for data at rest (provided by Supabase infrastructure)</li>
          <li><strong>Access Controls:</strong> Role-based access control (RBAC) with 12 defined roles</li>
          <li><strong>Application Security:</strong> SQL injection prevention, XSS protection, CSRF tokens, input validation</li>
          <li><strong>Rate Limiting:</strong> API rate limiting per subscription tier to prevent abuse</li>
          <li><strong>Blockchain:</strong> Hyperledger Fabric for tamper-proof audit trails (cryptographic hashes only, not personal data)</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">3.2 Infrastructure Security</h3>
        <div className="bg-secondary/20 p-4 rounded-lg my-4">
          <p className="text-sm">
            Our platform is hosted on Supabase cloud infrastructure which provides:
          </p>
          <ul className="text-sm mt-2">
            <li>• Automated backups and disaster recovery</li>
            <li>• Network isolation and firewall protection</li>
            <li>• Regular security updates and patches</li>
            <li>• Geographic data residency options</li>
          </ul>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-l-yellow-500 p-4 rounded-lg my-4">
          <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Transparency Notice
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            While we implement robust security measures, no system is 100% secure. We commit to:
            <br />• Notifying affected users within 72 hours of confirmed data breaches
            <br />• Continuously improving our security posture
            <br />• Engaging third-party security assessments as resources allow
          </p>
        </div>

        <h2 className="mt-8 text-2xl font-semibold flex items-center gap-2">
          <Clock className="h-6 w-6" />
          4. Data Retention Policy
        </h2>
        
        <p>We retain data in accordance with Kenya law and international best practices:</p>

        <Card className="my-4">
          <CardHeader>
            <CardTitle className="text-lg">Retention Periods by Data Type</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Data Category</th>
                  <th className="text-left py-2">Retention</th>
                  <th className="text-left py-2">Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Procurement Records (Tenders, Bids, Contracts)</td>
                  <td className="py-2"><Badge variant="outline">7 Years</Badge></td>
                  <td className="py-2 text-muted-foreground">PPRA 2015 Section 67</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Audit Logs</td>
                  <td className="py-2"><Badge variant="outline">10 Years</Badge></td>
                  <td className="py-2 text-muted-foreground">PPRA 2015 + Kenya Evidence Act</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Blockchain Transaction Hashes</td>
                  <td className="py-2"><Badge variant="secondary">Permanent</Badge></td>
                  <td className="py-2 text-muted-foreground">Immutable by design (no PII stored)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">User Profiles</td>
                  <td className="py-2"><Badge variant="outline">7 Years</Badge></td>
                  <td className="py-2 text-muted-foreground">Kenya Data Protection Act 2019</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Appeal Records</td>
                  <td className="py-2"><Badge variant="outline">7 Years</Badge></td>
                  <td className="py-2 text-muted-foreground">PPRA 2015 Section 168</td>
                </tr>
                <tr>
                  <td className="py-2">Operational Notifications</td>
                  <td className="py-2"><Badge variant="outline">2 Years</Badge></td>
                  <td className="py-2 text-muted-foreground">Internal policy</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <h2 className="mt-8 text-2xl font-semibold flex items-center gap-2">
          <Key className="h-6 w-6" />
          5. Blockchain and Data Immutability
        </h2>
        
        <p>ProcureChain uses Hyperledger Fabric blockchain (a private/permissioned blockchain) for transaction integrity. You acknowledge that:</p>
        <ul>
          <li><strong>Immutability:</strong> Transaction hashes and metadata recorded on blockchain cannot be altered or deleted</li>
          <li><strong>Privacy Protection:</strong> Personal identifiable information (PII) is NOT stored on blockchain - only cryptographic hashes (SHA-256)</li>
          <li><strong>Verification:</strong> Any party can verify document authenticity using blockchain records through our platform</li>
          <li><strong>Private Network:</strong> Unlike public blockchains (Ethereum, Polygon), our records are not viewable on public explorers like Polygonscan. Verification is done through our secure platform interface.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          6. Your Data Protection Rights
        </h2>
        
        <p>Under Kenya Data Protection Act 2019 and GDPR, you have the following rights:</p>

        <div className="grid gap-4 my-4">
          <Card>
            <CardContent className="pt-4">
              <h4 className="font-semibold">Right of Access</h4>
              <p className="text-sm text-muted-foreground">
                Request a copy of all personal data we hold about you. We will provide this within 30 days in a 
                commonly used electronic format.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <h4 className="font-semibold">Right to Rectification</h4>
              <p className="text-sm text-muted-foreground">
                Update or correct inaccurate personal data directly through your account settings or by contacting our 
                Data Protection Officer.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <h4 className="font-semibold">Right to Erasure</h4>
              <p className="text-sm text-muted-foreground">
                Request deletion of your personal data, subject to legal retention requirements. Procurement records must 
                be retained for 7 years under PPRA regulations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <h4 className="font-semibold">Right to Data Portability</h4>
              <p className="text-sm text-muted-foreground">
                Request your data in a structured, machine-readable format (JSON, CSV) for transfer to another service.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <h4 className="font-semibold">Right to Lodge a Complaint</h4>
              <p className="text-sm text-muted-foreground">
                Contact the Office of the Data Protection Commissioner (Kenya): 
                <a href="https://www.odpc.go.ke" className="text-primary underline ml-1">www.odpc.go.ke</a>
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="mt-8 text-2xl font-semibold flex items-center gap-2">
          <Globe className="h-6 w-6" />
          7. International Data Transfers
        </h2>
        
        <p>
          Your data may be processed and stored in Kenya or other countries where our service providers operate 
          (primarily cloud infrastructure). When we transfer data internationally, we ensure appropriate safeguards:
        </p>
        <ul>
          <li>Standard Contractual Clauses (SCCs) with international service providers</li>
          <li>Data Processing Agreements with all service providers</li>
          <li>Encryption and pseudonymization for cross-border transfers</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">8. Contact Us</h2>
        
        <div className="bg-secondary/20 p-6 rounded-lg my-4">
          <p><strong>Data Protection Officer</strong></p>
          <p>ProcureChain Kenya Limited</p>
          <p>Email: privacy@procurechain.co.ke</p>
          <p>Phone: +254 (0) 20 123 4567</p>
          <p>Address: Nairobi, Kenya</p>
        </div>

        <h2 className="mt-8 text-2xl font-semibold">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes will be notified via email (30 days advance notice) 
          and prominently displayed on the platform. Your continued use after changes constitutes acceptance.
        </p>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Related Policies: <a href="/terms" className="text-primary underline">Terms of Service</a> | 
            <a href="/cookies" className="text-primary underline ml-2">Cookie Policy</a> | 
            <a href="/data-protection" className="text-primary underline ml-2">Data Protection Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
