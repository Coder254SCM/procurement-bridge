import React from 'react';

const Privacy = () => {
  const lastUpdated = "October 1, 2025";

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="prose prose-lg max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>

        <div className="bg-blue-50 border-l-4 border-l-blue-500 p-6 rounded-lg my-6">
          <p className="font-semibold text-blue-800 mb-2">Your Privacy is Our Priority</p>
          <p className="text-sm text-blue-700">
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

        <h2 className="mt-8 text-2xl font-semibold">1. Information We Collect</h2>
        
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
            <strong>Communication Data:</strong> Messages, inquiries, support tickets, clarification questions, and any other 
            correspondence with us or other platform users.
          </li>
          <li>
            <strong>Financial Information:</strong> Payment methods, bank account details, financial statements, credit history, 
            and transaction records for subscription and procurement payments.
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
            <strong>Cookies and Tracking Technologies:</strong> Session cookies, persistent cookies, web beacons, pixel tags, 
            and local storage to remember preferences and analyze platform usage.
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
            <strong>Credit Reference Bureaus:</strong> Credit scores and financial history for supplier qualification assessments.
          </li>
          <li>
            <strong>Payment Processors:</strong> Transaction confirmations, payment status, and billing information from M-Pesa, 
            Stripe, and other payment gateways.
          </li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">2. How We Use Your Information</h2>
        
        <p>We use collected information for the following specific purposes:</p>

        <h3 className="mt-4 text-xl font-semibold">2.1 Platform Operations and Service Delivery</h3>
        <ul>
          <li>Create, maintain, and manage user accounts and profiles</li>
          <li>Process tender publications, bid submissions, and contract awards</li>
          <li>Facilitate communication between buyers, suppliers, and evaluators</li>
          <li>Provide customer support and respond to inquiries</li>
          <li>Manage subscriptions and process payments</li>
          <li>Send transactional notifications (bid confirmations, award notices, payment receipts)</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">2.2 Verification and Compliance</h3>
        <ul>
          <li>Verify user identity, business registration, and professional licenses</li>
          <li>Conduct Know Your Customer (KYC) and Anti-Money Laundering (AML) checks</li>
          <li>Assess supplier qualifications and creditworthiness</li>
          <li>Ensure compliance with Public Procurement and Asset Disposal Act 2015</li>
          <li>Monitor for fraudulent activities, bid rigging, and corruption</li>
          <li>Maintain audit trails for regulatory inspections</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">2.3 Platform Improvement and Analytics</h3>
        <ul>
          <li>Analyze usage patterns to improve platform features and user experience</li>
          <li>Develop AI-powered recommendations for tender-supplier matching</li>
          <li>Generate aggregate statistics and market intelligence reports</li>
          <li>Conduct research on procurement trends and best practices</li>
          <li>Test new features and optimize platform performance</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">2.4 Security and Fraud Prevention</h3>
        <ul>
          <li>Detect and prevent fraud, unauthorized access, and security breaches</li>
          <li>Monitor for suspicious activities and anomalous behavior patterns</li>
          <li>Enforce platform terms of service and acceptable use policies</li>
          <li>Protect against spam, malware, and distributed denial-of-service attacks</li>
          <li>Conduct security audits and vulnerability assessments</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">2.5 Legal and Regulatory Compliance</h3>
        <ul>
          <li>Comply with legal obligations under Kenya law and international regulations</li>
          <li>Respond to court orders, subpoenas, and law enforcement requests</li>
          <li>Protect our legal rights and defend against claims</li>
          <li>Enforce contracts and terms of service</li>
          <li>Prepare for and respond to regulatory audits</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">3. Legal Basis for Processing (GDPR Compliance)</h2>
        <p>We process personal data under the following legal bases:</p>
        <ul>
          <li><strong>Contract Performance:</strong> Processing necessary to fulfill our contractual obligations to you</li>
          <li><strong>Legal Obligation:</strong> Compliance with Kenya procurement laws, tax regulations, and AML requirements</li>
          <li><strong>Legitimate Interests:</strong> Fraud prevention, security monitoring, and platform improvement</li>
          <li><strong>Consent:</strong> Marketing communications and optional features (you can withdraw consent anytime)</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">4. Data Sharing and Disclosure</h2>
        
        <h3 className="mt-4 text-xl font-semibold">4.1 With Other Platform Users</h3>
        <ul>
          <li><strong>Public Tenders:</strong> Tender details, buyer information, and submission requirements are visible to all registered suppliers</li>
          <li><strong>Awarded Contracts:</strong> Winning supplier names and contract values may be published for transparency</li>
          <li><strong>Supplier Profiles:</strong> Basic company information, verification status, and ratings visible to buyers</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">4.2 With Service Providers and Partners</h3>
        <ul>
          <li><strong>Payment Processors:</strong> Stripe, M-Pesa, PayPal for subscription and transaction processing</li>
          <li><strong>Identity Verification Services:</strong> Third-party KYC providers for document verification</li>
          <li><strong>Cloud Infrastructure:</strong> Supabase, AWS for hosting and data storage</li>
          <li><strong>Analytics Providers:</strong> Google Analytics, Mixpanel for usage analysis (anonymized data)</li>
          <li><strong>Communication Services:</strong> Email providers, SMS gateways for notifications</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">4.3 With Government Authorities</h3>
        <ul>
          <li><strong>Public Procurement Information Portal (PPIP):</strong> Tender publications and award notices</li>
          <li><strong>Kenya Revenue Authority:</strong> Tax compliance verification and financial reporting</li>
          <li><strong>PPRA and Auditors:</strong> Procurement records for compliance audits</li>
          <li><strong>Law Enforcement:</strong> When legally required by court order or investigation</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">4.4 Business Transfers</h3>
        <p>
          In the event of a merger, acquisition, reorganization, or sale of assets, your personal data may be transferred 
          to the acquiring entity. You will be notified via email and platform notice before any transfer occurs.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">5. Data Security Measures</h2>
        
        <p>We implement industry-leading security measures to protect your data:</p>

        <h3 className="mt-4 text-xl font-semibold">5.1 Technical Security</h3>
        <ul>
          <li><strong>Encryption:</strong> TLS 1.3 for data in transit; AES-256 encryption for data at rest</li>
          <li><strong>Access Controls:</strong> Role-based access control (RBAC), multi-factor authentication (MFA)</li>
          <li><strong>Network Security:</strong> Firewall protection, intrusion detection/prevention systems, DDoS mitigation</li>
          <li><strong>Application Security:</strong> SQL injection prevention, XSS protection, CSRF tokens, secure coding practices</li>
          <li><strong>Blockchain:</strong> Hyperledger Fabric for tamper-proof audit trails and transaction integrity</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">5.2 Organizational Security</h3>
        <ul>
          <li><strong>Background Checks:</strong> All employees undergo comprehensive background verification</li>
          <li><strong>Training:</strong> Mandatory annual security and privacy training for all staff</li>
          <li><strong>Access Logs:</strong> All data access is logged and monitored for unauthorized activity</li>
          <li><strong>Incident Response:</strong> 24/7 security monitoring with 15-minute incident response time</li>
          <li><strong>Penetration Testing:</strong> Quarterly security assessments by independent third parties</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">5.3 Compliance Certifications</h3>
        <ul>
          <li>ISO 27001 Information Security Management (certification in progress)</li>
          <li>SOC 2 Type II compliance for service organizations</li>
          <li>PCI DSS Level 1 for payment card data protection</li>
          <li>Kenya Data Protection Act 2019 compliance</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">6. Your Data Protection Rights</h2>
        
        <p>Under Kenya Data Protection Act and GDPR, you have the following rights:</p>

        <h3 className="mt-4 text-xl font-semibold">6.1 Right of Access</h3>
        <p>
          You can request a copy of all personal data we hold about you. We will provide this within 30 days in a 
          commonly used electronic format. First request is free; subsequent requests may incur reasonable administrative fees.
        </p>

        <h3 className="mt-4 text-xl font-semibold">6.2 Right to Rectification</h3>
        <p>
          You can update or correct inaccurate personal data directly through your account settings or by contacting our 
          Data Protection Officer. We will respond within 7 days and update records within 30 days.
        </p>

        <h3 className="mt-4 text-xl font-semibold">6.3 Right to Erasure ("Right to be Forgotten")</h3>
        <p>
          You can request deletion of your personal data, subject to legal retention requirements. We must retain certain 
          procurement records for 7 years under PPRA regulations. After this period, data will be permanently deleted.
        </p>

        <h3 className="mt-4 text-xl font-semibold">6.4 Right to Data Portability</h3>
        <p>
          You can request your data in a structured, machine-readable format (JSON, CSV, XML) and transfer it to another 
          service provider. We will provide this within 30 days at no charge.
        </p>

        <h3 className="mt-4 text-xl font-semibold">6.5 Right to Object</h3>
        <p>
          You can object to processing for direct marketing purposes (opt-out anytime). For processing based on legitimate 
          interests, you can object and we will cease unless we have compelling grounds to continue.
        </p>

        <h3 className="mt-4 text-xl font-semibold">6.6 Right to Restrict Processing</h3>
        <p>
          You can request temporary restriction of processing while we verify data accuracy or assess your objection to processing.
        </p>

        <h3 className="mt-4 text-xl font-semibold">6.7 Right to Lodge a Complaint</h3>
        <p>
          If you believe your data protection rights have been violated, you can lodge a complaint with:
        </p>
        <div className="bg-secondary/20 p-4 rounded-lg mt-2">
          <p><strong>Office of the Data Protection Commissioner (Kenya)</strong></p>
          <p>Website: <a href="https://www.odpc.go.ke" className="text-blue-600 underline">www.odpc.go.ke</a></p>
          <p>Email: info@odpc.go.ke</p>
          <p>Phone: +254 (0) 20 2912 230</p>
        </div>

        <h2 className="mt-8 text-2xl font-semibold">7. Data Retention and Deletion</h2>
        
        <h3 className="mt-4 text-xl font-semibold">7.1 Retention Periods</h3>
        <ul>
          <li><strong>Procurement Records:</strong> 7 years from contract completion (PPRA requirement)</li>
          <li><strong>Blockchain Transactions:</strong> Permanent (immutable records for transparency)</li>
          <li><strong>Account Data:</strong> Until account deletion or 2 years after last activity</li>
          <li><strong>Audit Logs:</strong> 10 years for compliance and legal requirements</li>
          <li><strong>Financial Records:</strong> 7 years for tax and accounting purposes</li>
          <li><strong>Support Communications:</strong> 3 years after issue resolution</li>
          <li><strong>Marketing Data:</strong> Until consent withdrawal or 2 years of inactivity</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">7.2 Secure Deletion</h3>
        <p>
          When data is deleted, we use secure deletion methods including overwriting, degaussing, and physical destruction 
          of storage media to ensure data cannot be recovered.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">8. Blockchain and Data Immutability</h2>
        
        <p>ProcureChain uses Hyperledger Fabric blockchain for transaction integrity. You acknowledge that:</p>
        <ul>
          <li><strong>Immutability:</strong> Transaction hashes and metadata recorded on blockchain cannot be altered or deleted</li>
          <li><strong>Transparency:</strong> Blockchain records serve as permanent, tamper-proof audit trails</li>
          <li><strong>Privacy Protection:</strong> Personal identifiable information is NOT stored on blockchain - only cryptographic hashes</li>
          <li><strong>Document Integrity:</strong> Only document fingerprints (SHA-256 hashes) are recorded, not actual documents</li>
          <li><strong>Verification:</strong> Any party can verify document authenticity using blockchain records</li>
          <li><strong>Regulatory Compliance:</strong> Blockchain audit trails support anti-corruption and transparency mandates</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">9. International Data Transfers</h2>
        
        <p>
          Your data may be processed and stored in Kenya or other countries where our service providers operate. 
          When we transfer data internationally, we ensure appropriate safeguards:
        </p>
        <ul>
          <li>Standard Contractual Clauses (SCCs) approved by European Commission</li>
          <li>Data Processing Agreements with all international service providers</li>
          <li>Adequacy decisions for transfers to countries with equivalent data protection</li>
          <li>Encryption and pseudonymization for cross-border transfers</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">10. Cookies and Tracking Technologies</h2>
        
        <h3 className="mt-4 text-xl font-semibold">10.1 Types of Cookies We Use</h3>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for platform functionality (session management, authentication)</li>
          <li><strong>Performance Cookies:</strong> Analyze platform usage to improve performance</li>
          <li><strong>Functional Cookies:</strong> Remember preferences and settings</li>
          <li><strong>Marketing Cookies:</strong> Deliver targeted content (with consent)</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">10.2 Cookie Management</h3>
        <p>
          You can control cookies through browser settings. Disabling essential cookies may limit platform functionality. 
          Our cookie banner allows granular control over non-essential cookies.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">11. Children's Privacy</h2>
        <p>
          The Platform is not intended for individuals under 18 years of age. We do not knowingly collect personal data 
          from children. If you believe we have inadvertently collected data from a minor, contact us immediately for deletion.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">12. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy to reflect legal changes, new features, or improved practices. Material changes 
          will be notified via:
        </p>
        <ul>
          <li>Email notification to registered users (30 days advance notice)</li>
          <li>Prominent platform notice on login page</li>
          <li>Updated "Last Updated" date at top of policy</li>
        </ul>
        <p>
          Continued use of the platform after changes constitutes acceptance. If you disagree with changes, you may 
          terminate your account.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">13. Data Breach Notification</h2>
        <p>
          In the unlikely event of a data breach affecting your personal information, we will:
        </p>
        <ul>
          <li>Notify affected users within 72 hours of breach discovery</li>
          <li>Report to Office of Data Protection Commissioner within 72 hours</li>
          <li>Provide details of breach scope, affected data, and mitigation actions</li>
          <li>Offer credit monitoring or identity theft protection services if appropriate</li>
          <li>Conduct thorough investigation and implement corrective measures</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">14. Contact Us</h2>
        <p>
          For questions about this Privacy Policy, data protection rights, or data practices, contact:
        </p>
        <div className="bg-secondary/20 p-4 rounded-lg">
          <p className="mb-2">
            <strong>ProcureChain Data Protection Officer</strong>
          </p>
          <p>Email: privacy@procurechain.co.ke</p>
          <p>Support: support@procurechain.co.ke</p>
          <p>Phone: +254 700 000 000</p>
          <p>Address: Westlands Office Park, Waiyaki Way, Nairobi, Kenya</p>
          <p>Working Hours: Monday-Friday, 8:00 AM - 5:00 PM EAT</p>
          <p>Response Time: Within 48 hours for privacy inquiries</p>
        </div>

        <div className="mt-8 p-6 bg-blue-50 border-l-4 border-l-blue-500 rounded">
          <p className="font-semibold mb-2">Your Rights Matter</p>
          <p className="text-sm">
            We are committed to protecting your privacy and ensuring transparent data practices. If you believe your 
            rights have been violated or have concerns about our data practices, please contact our Data Protection 
            Officer first. If unresolved, you may lodge a complaint with the Office of the Data Protection Commissioner 
            (Kenya) at <a href="https://www.odpc.go.ke" className="text-blue-600 underline">www.odpc.go.ke</a>
          </p>
        </div>

        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded">
          <p className="font-semibold text-green-800 mb-2">International Standards Compliance</p>
          <p className="text-sm text-green-700">
            This Privacy Policy complies with:
          </p>
          <ul className="text-sm text-green-700 mt-2">
            <li>• Kenya Data Protection Act, 2019</li>
            <li>• Public Procurement and Asset Disposal Act, 2015</li>
            <li>• General Data Protection Regulation (GDPR) of the European Union</li>
            <li>• ISO 27001 Information Security Management Standards</li>
            <li>• SOC 2 Trust Service Criteria</li>
            <li>• PCI DSS Payment Card Industry Standards</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
