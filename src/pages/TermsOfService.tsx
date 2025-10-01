import React from 'react';

const TermsOfService = () => {
  const lastUpdated = "October 1, 2025";
  const effectiveDate = "October 1, 2025";

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="prose prose-lg max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last Updated: {lastUpdated} | Effective Date: {effectiveDate}
        </p>

        <p className="lead">
          These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and ProcureChain Kenya Limited ("ProcureChain," "we," "us," or "our") governing your access to and use of the ProcureChain e-Government Procurement Platform (the "Platform"). By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p>
          By creating an account, accessing, or using any part of the Platform, you affirm that you are at least 18 years old and have the legal capacity to enter into this agreement. If you are accessing the Platform on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">2. Description of Services</h2>
        <p>
          ProcureChain provides a comprehensive blockchain-enabled procurement platform designed to facilitate transparent, secure, and efficient public procurement processes in Kenya. Our services include but are not limited to:
        </p>
        <ul>
          <li>Electronic tendering and bidding management</li>
          <li>Supplier verification and qualification systems</li>
          <li>Contract lifecycle management</li>
          <li>E-catalog and requisition management</li>
          <li>Blockchain-based transaction verification</li>
          <li>Compliance and audit trail functionality</li>
          <li>Analytics and reporting tools</li>
          <li>Enterprise integration services (optional)</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">3. User Accounts and Registration</h2>
        <h3 className="mt-4 text-xl font-semibold">3.1 Account Creation</h3>
        <p>
          To access certain features of the Platform, you must register for an account by providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
        <h3 className="mt-4 text-xl font-semibold">3.2 Account Security</h3>
        <p>
          You agree to immediately notify ProcureChain of any unauthorized use of your account or any other breach of security. ProcureChain will not be liable for any loss or damage arising from your failure to comply with these security obligations.
        </p>
        <h3 className="mt-4 text-xl font-semibold">3.3 Verification Requirements</h3>
        <p>
          Certain user roles, particularly suppliers, may be required to complete identity verification, business registration verification, and compliance checks. Failure to complete required verification may result in limited platform access or account suspension.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">4. User Roles and Responsibilities</h2>
        <h3 className="mt-4 text-xl font-semibold">4.1 Buyers</h3>
        <p>
          Buyer users represent government entities or authorized procurement organizations. Buyers are responsible for:
        </p>
        <ul>
          <li>Creating accurate and complete tender specifications</li>
          <li>Ensuring compliance with applicable procurement laws and regulations</li>
          <li>Conducting fair and transparent evaluation processes</li>
          <li>Maintaining proper documentation throughout the procurement lifecycle</li>
        </ul>
        <h3 className="mt-4 text-xl font-semibold">4.2 Suppliers</h3>
        <p>
          Supplier users are businesses or individuals seeking to participate in procurement opportunities. Suppliers are responsible for:
        </p>
        <ul>
          <li>Providing accurate business and verification information</li>
          <li>Submitting truthful and compliant bids</li>
          <li>Fulfilling contractual obligations if awarded</li>
          <li>Maintaining valid licenses, certifications, and permits</li>
        </ul>
        <h3 className="mt-4 text-xl font-semibold">4.3 Evaluators</h3>
        <p>
          Evaluators are authorized to assess bids based on their expertise. Evaluators must conduct impartial, professional evaluations and maintain confidentiality of sensitive information.
        </p>
        <h3 className="mt-4 text-xl font-semibold">4.4 Auditors</h3>
        <p>
          Auditors have read-only access to system audit trails and transaction logs. Auditors must maintain confidentiality and use audit information solely for compliance and oversight purposes.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">5. Acceptable Use Policy</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Platform for any illegal, fraudulent, or unauthorized purpose</li>
          <li>Attempt to gain unauthorized access to any portion of the Platform</li>
          <li>Interfere with or disrupt the Platform's operation or servers</li>
          <li>Upload or transmit viruses, malware, or any malicious code</li>
          <li>Scrape, mine, or harvest data from the Platform without authorization</li>
          <li>Impersonate any person or entity or misrepresent your affiliation</li>
          <li>Engage in bid rigging, collusion, or any anti-competitive practices</li>
          <li>Submit false, misleading, or fraudulent information</li>
          <li>Share account credentials with unauthorized parties</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">6. Intellectual Property Rights</h2>
        <h3 className="mt-4 text-xl font-semibold">6.1 Platform Ownership</h3>
        <p>
          The Platform, including all software, designs, text, graphics, logos, and other content (excluding user-generated content), is owned by ProcureChain and protected by intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to access and use the Platform in accordance with these Terms.
        </p>
        <h3 className="mt-4 text-xl font-semibold">6.2 User Content</h3>
        <p>
          You retain ownership of content you submit to the Platform. However, by submitting content, you grant ProcureChain a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content as necessary to provide the Platform services.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">7. Blockchain and Data Integrity</h2>
        <p>
          ProcureChain utilizes Hyperledger Fabric blockchain technology to ensure transaction immutability and transparency. You acknowledge that:
        </p>
        <ul>
          <li>Blockchain transactions are immutable and cannot be altered or deleted</li>
          <li>Transaction hashes and metadata may be permanently recorded on the blockchain</li>
          <li>Blockchain records serve as tamper-proof audit trails</li>
          <li>ProcureChain implements cryptographic hashing for document integrity verification</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">8. Service Levels and Availability</h2>
        <h3 className="mt-4 text-xl font-semibold">8.1 Service Availability</h3>
        <p>
          ProcureChain strives to maintain 99.5% platform uptime, excluding scheduled maintenance. We reserve the right to temporarily suspend access for maintenance, upgrades, or emergency repairs.
        </p>
        <h3 className="mt-4 text-xl font-semibold">8.2 No Warranty</h3>
        <p>
          THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">9. Enterprise Services and Custom Integrations</h2>
        <p>
          ProcureChain offers optional enterprise services including:
        </p>
        <ul>
          <li>SAP Ariba integration and synchronization</li>
          <li>Oracle Procurement Cloud connectivity</li>
          <li>Custom ERP system integration</li>
          <li>Dedicated technical support and training</li>
          <li>White-label deployment options</li>
          <li>Advanced analytics and custom reporting</li>
        </ul>
        <p>
          Enterprise services are subject to separate commercial agreements and service level agreements (SLAs). Contact enterprise@procurechain.co.ke for more information.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">10. Payment Terms and Subscription</h2>
        <h3 className="mt-4 text-xl font-semibold">10.1 Subscription Plans</h3>
        <p>
          Access to the Platform may require a paid subscription. Current pricing plans are available at procurechain.co.ke/pricing. Subscription fees are non-refundable except as required by law.
        </p>
        <h3 className="mt-4 text-xl font-semibold">10.2 Trial Period</h3>
        <p>
          New users may be eligible for a free trial period. Trial accounts have limited functionality and transaction volume. At the end of the trial, your account will be downgraded or suspended unless you purchase a paid subscription.
        </p>
        <h3 className="mt-4 text-xl font-semibold">10.3 Payment Processing</h3>
        <p>
          Payments are processed through secure third-party payment gateways. You authorize ProcureChain to charge your designated payment method for all applicable fees.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">11. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, PROCURECHAIN, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:
        </p>
        <ul>
          <li>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
          <li>LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES</li>
          <li>DAMAGES RESULTING FROM UNAUTHORIZED ACCESS TO YOUR ACCOUNT</li>
          <li>DAMAGES ARISING FROM THIRD-PARTY ACTIONS OR CONTENT</li>
          <li>SYSTEM FAILURES, DOWNTIME, OR DATA LOSS</li>
        </ul>
        <p>
          IN NO EVENT SHALL PROCURECHAIN'S TOTAL LIABILITY EXCEED THE AMOUNT PAID BY YOU TO PROCURECHAIN IN THE 12 MONTHS PRECEDING THE CLAIM, OR KES 100,000, WHICHEVER IS LESS.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">12. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless ProcureChain and its affiliates from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from:
        </p>
        <ul>
          <li>Your use or misuse of the Platform</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any applicable laws or regulations</li>
          <li>Your infringement of any third-party rights</li>
          <li>Content you submit to the Platform</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">13. Data Protection and Privacy</h2>
        <p>
          Your use of the Platform is subject to our Privacy Policy, which describes how we collect, use, and protect your personal data. By using the Platform, you consent to our data practices as described in the Privacy Policy.
        </p>
        <p>
          ProcureChain complies with Kenya Data Protection Act, 2019 and implements industry-standard security measures to protect user data.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">14. Compliance with Laws</h2>
        <p>
          Users must comply with all applicable laws and regulations, including:
        </p>
        <ul>
          <li>Public Procurement and Asset Disposal Act, 2015 (Kenya)</li>
          <li>Anti-Corruption and Economic Crimes Act (Kenya)</li>
          <li>Competition Act (Kenya)</li>
          <li>Tax laws and regulations</li>
          <li>Business licensing requirements</li>
          <li>International trade and sanctions laws (if applicable)</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">15. Termination</h2>
        <h3 className="mt-4 text-xl font-semibold">15.1 Termination by User</h3>
        <p>
          You may terminate your account at any time by contacting support@procurechain.co.ke. Termination does not relieve you of obligations incurred prior to termination.
        </p>
        <h3 className="mt-4 text-xl font-semibold">15.2 Termination by ProcureChain</h3>
        <p>
          ProcureChain may suspend or terminate your account immediately, without notice, for:
        </p>
        <ul>
          <li>Violation of these Terms</li>
          <li>Fraudulent or illegal activity</li>
          <li>Non-payment of subscription fees</li>
          <li>Providing false or misleading information</li>
          <li>Breach of security or confidentiality</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">16. Dispute Resolution</h2>
        <h3 className="mt-4 text-xl font-semibold">16.1 Governing Law</h3>
        <p>
          These Terms are governed by the laws of the Republic of Kenya, without regard to conflict of law principles.
        </p>
        <h3 className="mt-4 text-xl font-semibold">16.2 Arbitration</h3>
        <p>
          Any dispute arising from these Terms shall be resolved through binding arbitration in Nairobi, Kenya, under the Arbitration Act, 1995, before a single arbitrator appointed by mutual agreement or by the Nairobi Centre for International Arbitration (NCIA).
        </p>
        <h3 className="mt-4 text-xl font-semibold">16.3 Class Action Waiver</h3>
        <p>
          You agree that disputes will be resolved on an individual basis and waive any right to participate in class action lawsuits or class-wide arbitration.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">17. Changes to Terms</h2>
        <p>
          ProcureChain reserves the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on the Platform and updating the "Last Updated" date. Your continued use of the Platform after such changes constitutes acceptance of the modified Terms.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">18. Severability</h2>
        <p>
          If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">19. Entire Agreement</h2>
        <p>
          These Terms, together with the Privacy Policy and any applicable commercial agreements, constitute the entire agreement between you and ProcureChain regarding the Platform and supersede all prior agreements and understandings.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">20. Contact Information</h2>
        <p>
          For questions about these Terms or the Platform, contact us at:
        </p>
        <div className="bg-secondary/20 p-4 rounded-lg">
          <p className="mb-2">
            <strong>ProcureChain Kenya Limited</strong>
          </p>
          <p>Email: legal@procurechain.co.ke</p>
          <p>Support: support@procurechain.co.ke</p>
          <p>Enterprise Services: enterprise@procurechain.co.ke</p>
          <p>Phone: +254 700 000 000</p>
          <p>Address: Nairobi, Kenya</p>
        </div>

        <div className="mt-12 p-6 bg-blue-50 border-l-4 border-l-blue-500 rounded">
          <p className="font-semibold mb-2">Important Notice</p>
          <p className="text-sm">
            By clicking "I Accept" during registration or by continuing to use the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these Terms, you must immediately cease using the Platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
