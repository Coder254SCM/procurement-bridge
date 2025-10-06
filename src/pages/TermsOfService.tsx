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

        <div className="bg-red-50 border-l-4 border-l-red-500 p-6 rounded-lg my-6">
          <p className="font-semibold text-red-800 mb-2">Important Legal Agreement</p>
          <p className="text-sm text-red-700">
            These Terms constitute a legally binding contract between you and ProcureChain Kenya Limited. By using 
            the platform, you accept these Terms in full. If you disagree with any part, you must not use the platform. 
            Please read carefully before proceeding.
          </p>
        </div>

        <p className="lead">
          These Terms of Service ("Terms", "Agreement") constitute a legally binding agreement between you 
          ("User," "you," or "your") and ProcureChain Kenya Limited ("ProcureChain," "Company," "we," "us," or "our"), 
          a company incorporated under the laws of Kenya with business registration number [PVT-XXXXXXX], governing 
          your access to and use of the ProcureChain e-Government Procurement Platform (the "Platform," "Service," or "System").
        </p>

        <h2 className="mt-8 text-2xl font-semibold">1. Acceptance of Terms</h2>
        
        <h3 className="mt-4 text-xl font-semibold">1.1 Agreement to Terms</h3>
        <p>
          By creating an account, accessing, browsing, or using any part of the Platform, you affirm that:
        </p>
        <ul>
          <li>You are at least 18 years old and have legal capacity to enter contracts</li>
          <li>You have read, understood, and agree to be bound by these Terms</li>
          <li>You have authority to bind your organization to these Terms (if acting on behalf of an entity)</li>
          <li>You will comply with all applicable laws, regulations, and procurement standards</li>
          <li>All information you provide is accurate, current, and complete</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">1.2 Modifications to Terms</h3>
        <p>
          We reserve the right to modify these Terms at any time. Material changes will be notified via:
        </p>
        <ul>
          <li>Email notification to registered users (30 days advance notice for material changes)</li>
          <li>Prominent notice on Platform login page</li>
          <li>In-app notification requiring acknowledgment for continued use</li>
        </ul>
        <p>
          Your continued use after changes constitutes acceptance. If you disagree with modifications, you must 
          immediately cease using the Platform and may terminate your account.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">2. Description of Services</h2>
        
        <p>
          ProcureChain provides a comprehensive blockchain-enabled e-procurement platform designed to facilitate 
          transparent, secure, and efficient public and private procurement processes in Kenya and beyond.
        </p>

        <h3 className="mt-4 text-xl font-semibold">2.1 Core Services Include:</h3>
        <ul>
          <li><strong>Tender Management:</strong> Electronic tendering, bid submission, evaluation, and award processes</li>
          <li><strong>Supplier Management:</strong> Verification, qualification, performance tracking, and directory services</li>
          <li><strong>Contract Lifecycle:</strong> Contract creation, e-signing, milestone tracking, and performance monitoring</li>
          <li><strong>E-Catalog:</strong> Pre-qualified supplier catalog with framework agreements</li>
          <li><strong>Requisition Management:</strong> Purchase requisition creation, approval workflows, and procurement planning</li>
          <li><strong>Blockchain Verification:</strong> Immutable transaction records using Hyperledger Fabric</li>
          <li><strong>Compliance Monitoring:</strong> Automated compliance checks against PPRA regulations and policies</li>
          <li><strong>Analytics & Reporting:</strong> Procurement insights, spend analysis, and regulatory reporting</li>
          <li><strong>Integration Services:</strong> ERP integration (SAP, Oracle), payment gateways (M-Pesa, Stripe), government APIs</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">2.2 Service Availability</h3>
        <ul>
          <li><strong>Target Uptime:</strong> 99.5% availability (excluding scheduled maintenance)</li>
          <li><strong>Scheduled Maintenance:</strong> Notified 7 days in advance, typically during off-peak hours</li>
          <li><strong>Emergency Maintenance:</strong> May occur with minimal notice for critical security updates</li>
          <li><strong>Service Level Agreements:</strong> Detailed SLAs available for enterprise customers</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">2.3 Beta Features</h3>
        <p>
          We may offer experimental or beta features ("Beta Services"). Beta Services are provided "AS IS" without 
          warranties, may be discontinued without notice, and should not be relied upon for critical procurement activities.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">3. User Accounts and Registration</h2>
        
        <h3 className="mt-4 text-xl font-semibold">3.1 Account Creation Requirements</h3>
        <p>To register for an account, you must provide:</p>
        <ul>
          <li>Accurate and complete registration information</li>
          <li>Valid business email address (disposable emails prohibited)</li>
          <li>Legal business registration documents</li>
          <li>Tax compliance certificates</li>
          <li>Authorized representative identification</li>
          <li>Bank account verification (for financial transactions)</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">3.2 Account Security Obligations</h3>
        <p>You agree to:</p>
        <ul>
          <li>Create a strong password (minimum 8 characters, mix of upper/lower case, numbers, symbols)</li>
          <li>Keep login credentials confidential and not share with unauthorized parties</li>
          <li>Enable multi-factor authentication (MFA) when available</li>
          <li>Immediately notify us of unauthorized access or security breaches</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Ensure devices used to access the Platform have updated security software</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">3.3 Account Verification</h3>
        <p>
          Certain user roles (particularly suppliers) require identity verification, business registration verification, 
          and compliance checks. Verification processes may include:
        </p>
        <ul>
          <li>Document authentication and validation</li>
          <li>Cross-verification with government databases (KRA, Business Registry)</li>
          <li>Credit checks and financial assessments</li>
          <li>Reference checks and past performance verification</li>
          <li>Physical site visits for high-value contracts</li>
        </ul>
        <p>
          Failure to complete required verification within specified timelines may result in limited platform access, 
          account suspension, or termination.
        </p>

        <h3 className="mt-4 text-xl font-semibold">3.4 Account Suspension and Termination</h3>
        <p>We may suspend or terminate your account immediately if:</p>
        <ul>
          <li>You violate these Terms or applicable laws</li>
          <li>You engage in fraudulent, deceptive, or illegal activities</li>
          <li>You provide false or misleading information</li>
          <li>You attempt to manipulate bidding processes or engage in collusion</li>
          <li>You fail to pay subscription fees or other charges</li>
          <li>Your account is involved in security incidents</li>
          <li>You are blacklisted by procurement authorities</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">4. User Roles and Responsibilities</h2>
        
        <h3 className="mt-4 text-xl font-semibold">4.1 Government Buyers</h3>
        <p>Buyer users represent government entities or authorized procurement organizations. Buyers are responsible for:</p>
        <ul>
          <li>Creating accurate, complete, and compliant tender specifications</li>
          <li>Ensuring compliance with Public Procurement and Asset Disposal Act 2015</li>
          <li>Conducting fair, transparent, and non-discriminatory evaluation processes</li>
          <li>Maintaining proper documentation throughout the procurement lifecycle</li>
          <li>Responding to supplier clarifications within prescribed timelines</li>
          <li>Ensuring tender budgets are approved and funds are available</li>
          <li>Awarding contracts based on merit and evaluation criteria</li>
          <li>Managing contracts and monitoring supplier performance</li>
          <li>Reporting procurement activities to PPRA as required</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">4.2 Suppliers</h3>
        <p>Supplier users are businesses or individuals seeking procurement opportunities. Suppliers are responsible for:</p>
        <ul>
          <li>Providing accurate and up-to-date business information</li>
          <li>Maintaining valid licenses, certifications, and permits</li>
          <li>Submitting truthful, compliant, and competitive bids</li>
          <li>Meeting all technical and financial requirements</li>
          <li>Fulfilling contractual obligations if awarded</li>
          <li>Delivering goods/services as specified and within agreed timelines</li>
          <li>Maintaining quality standards and professional conduct</li>
          <li>Complying with tax obligations and labor laws</li>
          <li>Not engaging in bid rigging, collusion, or corrupt practices</li>
          <li>Providing accurate pricing and cost breakdowns</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">4.3 Evaluators</h3>
        <p>Evaluators are authorized professionals who assess bids. Evaluators must:</p>
        <ul>
          <li>Conduct impartial, professional, and objective evaluations</li>
          <li>Maintain confidentiality of sensitive information</li>
          <li>Declare conflicts of interest before accepting assignments</li>
          <li>Complete evaluations within prescribed timelines</li>
          <li>Provide detailed justifications for scores and recommendations</li>
          <li>Not communicate with bidders outside official channels</li>
          <li>Follow evaluation methodologies and criteria strictly</li>
          <li>Report any suspicious activities or irregularities</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">4.4 Auditors</h3>
        <p>Auditors have read-only access to audit trails and transaction logs. Auditors must:</p>
        <ul>
          <li>Maintain strict confidentiality of audit information</li>
          <li>Use audit data solely for compliance and oversight purposes</li>
          <li>Report findings through proper regulatory channels</li>
          <li>Not disclose audit information to unauthorized parties</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">5. Acceptable Use Policy</h2>
        
        <h3 className="mt-4 text-xl font-semibold">5.1 Prohibited Activities</h3>
        <p>You agree NOT to:</p>
        <ul>
          <li><strong>Legal Violations:</strong> Use the Platform for illegal, fraudulent, or unauthorized purposes</li>
          <li><strong>Security Breaches:</strong> Attempt to gain unauthorized access, hack, or breach security measures</li>
          <li><strong>System Interference:</strong> Interfere with, disrupt, or overload Platform operations or servers</li>
          <li><strong>Malicious Code:</strong> Upload viruses, malware, ransomware, or any malicious software</li>
          <li><strong>Data Scraping:</strong> Scrape, mine, harvest, or extract data without authorization</li>
          <li><strong>Impersonation:</strong> Impersonate any person, entity, or misrepresent your affiliation</li>
          <li><strong>Bid Manipulation:</strong> Engage in bid rigging, collusion, price-fixing, or anti-competitive practices</li>
          <li><strong>False Information:</strong> Submit false, misleading, fraudulent, or materially incomplete information</li>
          <li><strong>Credential Sharing:</strong> Share account credentials with unauthorized parties</li>
          <li><strong>Reverse Engineering:</strong> Decompile, disassemble, or reverse engineer Platform software</li>
          <li><strong>Automated Access:</strong> Use bots, scrapers, or automated tools without authorization</li>
          <li><strong>Spam/Abuse:</strong> Send unsolicited communications or abuse messaging features</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">5.2 Consequences of Violations</h3>
        <p>Violations may result in:</p>
        <ul>
          <li>Immediate account suspension or termination</li>
          <li>Blacklisting from future procurement activities</li>
          <li>Reporting to law enforcement and regulatory authorities</li>
          <li>Legal action for damages and injunctive relief</li>
          <li>Loss of awarded contracts and performance securities</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">6. Intellectual Property Rights</h2>
        
        <h3 className="mt-4 text-xl font-semibold">6.1 Platform Ownership</h3>
        <p>
          The Platform, including all software, source code, algorithms, designs, text, graphics, logos, trademarks, 
          user interface, and other content (excluding user-generated content), is owned by ProcureChain and protected 
          by Kenya and international intellectual property laws, including:
        </p>
        <ul>
          <li>Copyright laws (Copyright Act, Cap 130)</li>
          <li>Trademark laws (Trademarks Act, Cap 506)</li>
          <li>Patent laws (Industrial Property Act, 2001)</li>
          <li>Trade secret and confidential information protection</li>
        </ul>
        <p>
          You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Platform 
          strictly in accordance with these Terms. This license does not grant any ownership rights.
        </p>

        <h3 className="mt-4 text-xl font-semibold">6.2 User Content License</h3>
        <p>
          You retain ownership of content you submit to the Platform ("User Content"), including tender documents, 
          bids, proposals, and communications. However, by submitting User Content, you grant ProcureChain:
        </p>
        <ul>
          <li>A worldwide, non-exclusive, royalty-free, perpetual license</li>
          <li>To use, reproduce, modify, adapt, publish, and display User Content</li>
          <li>As necessary to provide Platform services and improve functionality</li>
          <li>To create derivative works for analytics and reporting</li>
          <li>To sublicense to service providers necessary for Platform operations</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">6.3 Feedback and Suggestions</h3>
        <p>
          Any feedback, suggestions, or ideas you provide regarding the Platform become our property. We may use 
          them without compensation, restriction, or obligation to you.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">7. Blockchain and Data Integrity</h2>
        
        <p>
          ProcureChain utilizes Hyperledger Fabric blockchain technology to ensure transaction immutability, transparency, 
          and integrity. By using the Platform, you acknowledge and agree that:
        </p>

        <h3 className="mt-4 text-xl font-semibold">7.1 Immutable Records</h3>
        <ul>
          <li>Blockchain transactions are permanent and cannot be altered, edited, or deleted</li>
          <li>Transaction hashes, timestamps, and metadata are permanently recorded</li>
          <li>Blockchain records serve as tamper-proof audit trails for compliance</li>
          <li>Smart contracts execute automatically based on predefined conditions</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">7.2 Data Privacy on Blockchain</h3>
        <ul>
          <li>Personal identifiable information (PII) is NOT stored on blockchain</li>
          <li>Only cryptographic hashes (SHA-256) of documents are recorded</li>
          <li>Blockchain provides verification without exposing sensitive content</li>
          <li>Document hashes enable integrity verification while maintaining privacy</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">7.3 Legal Admissibility</h3>
        <p>
          Blockchain records and cryptographic signatures are legally admissible as evidence under Kenya Evidence Act 
          and Electronic Transactions Act, subject to proper authentication procedures.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">8. Payment Terms and Subscription</h2>
        
        <h3 className="mt-4 text-xl font-semibold">8.1 Subscription Plans and Pricing</h3>
        <p>Access to the Platform may require a paid subscription. Current pricing plans include:</p>
        <ul>
          <li><strong>Basic Plan:</strong> $99/month (1-5 users, limited tender value)</li>
          <li><strong>Professional Plan:</strong> $299/month (6-25 users, standard features)</li>
          <li><strong>Enterprise Plan:</strong> $599/month (26-100 users, advanced features)</li>
          <li><strong>Government Plan:</strong> $999/month (unlimited users, full features, dedicated support)</li>
          <li><strong>Custom Enterprise:</strong> Contact sales for pricing (1000+ users, white-label, custom integration)</li>
        </ul>
        <p>
          Current pricing is available at procurechain.co.ke/pricing. We reserve the right to modify pricing with 
          60 days notice to existing subscribers.
        </p>

        <h3 className="mt-4 text-xl font-semibold">8.2 Payment Processing</h3>
        <ul>
          <li>Payments are processed through secure third-party gateways (Stripe, M-Pesa, PayPal)</li>
          <li>You authorize ProcureChain to charge your designated payment method for all applicable fees</li>
          <li>Subscription fees are billed in advance on a monthly or annual basis</li>
          <li>Failed payments may result in service suspension after 15-day grace period</li>
          <li>All prices are exclusive of applicable taxes (VAT, withholding tax)</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">8.3 Refund Policy</h3>
        <ul>
          <li><strong>Subscription Fees:</strong> Non-refundable except as required by law</li>
          <li><strong>Pro-Rated Refunds:</strong> Available for annual subscriptions if downgrading</li>
          <li><strong>Trial Period:</strong> Free trials can be cancelled anytime before trial ends</li>
          <li><strong>Service Issues:</strong> Refunds considered on case-by-case basis for prolonged outages</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">8.4 Trial Period</h3>
        <ul>
          <li>New users may be eligible for a 14-day free trial</li>
          <li>Trial accounts have limited functionality and transaction volume</li>
          <li>One trial per organization/user (determined by email domain and IP)</li>
          <li>At trial end, account downgrades to free tier or requires paid subscription</li>
          <li>Payment method required upfront but not charged during trial</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">9. Limitation of Liability</h2>
        
        <div className="bg-yellow-50 border-l-4 border-l-yellow-500 p-4 my-4">
          <p className="font-semibold text-yellow-800 uppercase">Important Legal Limitation</p>
          <p className="text-sm text-yellow-700 mt-2">
            This section limits our liability to you. Please read carefully.
          </p>
        </div>

        <h3 className="mt-4 text-xl font-semibold">9.1 General Limitations</h3>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, PROCURECHAIN, ITS AFFILIATES, OFFICERS, DIRECTORS, 
          EMPLOYEES, AGENTS, SUPPLIERS, AND LICENSORS SHALL NOT BE LIABLE FOR:
        </p>
        <ul>
          <li><strong>Indirect Damages:</strong> Indirect, incidental, special, consequential, or punitive damages</li>
          <li><strong>Financial Losses:</strong> Loss of profits, revenue, business opportunities, or anticipated savings</li>
          <li><strong>Data Loss:</strong> Loss or corruption of data, even if foreseeable</li>
          <li><strong>Business Interruption:</strong> Interruption of business operations or lost time</li>
          <li><strong>Reputational Harm:</strong> Damage to reputation or goodwill</li>
          <li><strong>Third Party Actions:</strong> Actions or content of third parties on the Platform</li>
          <li><strong>Unauthorized Access:</strong> Unauthorized access to your account due to your negligence</li>
          <li><strong>Force Majeure:</strong> Acts of God, natural disasters, pandemics, war, terrorism</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">9.2 Maximum Liability Cap</h3>
        <p>
          IN NO EVENT SHALL PROCURECHAIN'S TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE 
          PLATFORM EXCEED THE GREATER OF:
        </p>
        <ul>
          <li>The amount paid by you to ProcureChain in the 12 months preceding the claim, OR</li>
          <li>KES 100,000 (Kenya Shillings One Hundred Thousand)</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">9.3 Basis of the Bargain</h3>
        <p>
          These limitations reflect the allocation of risk between the parties. The Platform pricing is based on 
          these limitations. Without them, the Platform would not be economically viable at current pricing.
        </p>

        <h3 className="mt-4 text-xl font-semibold">9.4 Jurisdictional Limitations</h3>
        <p>
          Some jurisdictions do not allow exclusion of certain warranties or limitation of liability for incidental 
          or consequential damages. In such jurisdictions, our liability is limited to the extent permitted by law.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">10. Indemnification</h2>
        
        <h3 className="mt-4 text-xl font-semibold">10.1 Your Indemnification Obligations</h3>
        <p>
          You agree to indemnify, defend, and hold harmless ProcureChain, its affiliates, officers, directors, 
          employees, agents, licensors, and service providers from and against any and all claims, liabilities, 
          damages, losses, costs, expenses (including reasonable attorneys' fees and court costs), arising from or related to:
        </p>
        <ul>
          <li>Your use or misuse of the Platform</li>
          <li>Your violation of these Terms or applicable laws</li>
          <li>Your violation of any third-party rights (intellectual property, privacy, publicity)</li>
          <li>User Content you submit, post, or transmit through the Platform</li>
          <li>Your breach of representations and warranties made in these Terms</li>
          <li>Your negligent, willful, or unlawful conduct</li>
          <li>Disputes between you and other users</li>
          <li>Your failure to fulfill contractual obligations to awarded contracts</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">10.2 Defense and Settlement</h3>
        <p>
          We reserve the right to assume exclusive defense and control of any matter subject to indemnification by you. 
          You will not settle any claim without our prior written consent.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">11. Compliance with Laws and Regulations</h2>
        
        <p>Users must comply with all applicable laws and regulations, including but not limited to:</p>

        <h3 className="mt-4 text-xl font-semibold">11.1 Kenya Laws</h3>
        <ul>
          <li><strong>Public Procurement and Asset Disposal Act, 2015:</strong> Procurement procedures and regulations</li>
          <li><strong>Anti-Corruption and Economic Crimes Act:</strong> Prohibition of bribery, corruption, fraud</li>
          <li><strong>Competition Act:</strong> Prohibition of anti-competitive practices, bid rigging, cartels</li>
          <li><strong>Data Protection Act, 2019:</strong> Personal data collection, processing, and protection</li>
          <li><strong>Tax Laws:</strong> Income Tax Act, VAT Act, tax compliance obligations</li>
          <li><strong>Business Registration:</strong> Companies Act, business licensing requirements</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">11.2 International Laws (if applicable)</h3>
        <ul>
          <li>International trade laws and export controls</li>
          <li>Economic sanctions and restricted party lists</li>
          <li>Anti-money laundering (AML) and counter-terrorism financing regulations</li>
          <li>GDPR (if processing EU residents' data)</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">12. Termination</h2>
        
        <h3 className="mt-4 text-xl font-semibold">12.1 Termination by User</h3>
        <p>You may terminate your account at any time by:</p>
        <ul>
          <li>Accessing account settings and selecting "Close Account"</li>
          <li>Contacting support@procurechain.co.ke with termination request</li>
          <li>Providing 30-day written notice for active contracts</li>
        </ul>
        <p>
          Termination does not relieve you of obligations incurred prior to termination, including payment obligations, 
          contractual commitments, and indemnification duties.
        </p>

        <h3 className="mt-4 text-xl font-semibold">12.2 Termination by ProcureChain</h3>
        <p>We may suspend or terminate your account immediately, with or without notice, for:</p>
        <ul>
          <li>Violation of these Terms or applicable laws</li>
          <li>Fraudulent, deceptive, or illegal activity</li>
          <li>Non-payment of subscription fees after 30-day grace period</li>
          <li>Providing false, misleading, or fraudulent information</li>
          <li>Breach of security, confidentiality, or data protection obligations</li>
          <li>Engaging in prohibited activities or acceptable use violations</li>
          <li>Blacklisting by procurement authorities</li>
          <li>Insolvency, bankruptcy, or liquidation proceedings</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">12.3 Effects of Termination</h3>
        <p>Upon termination:</p>
        <ul>
          <li>Your right to access and use the Platform immediately ceases</li>
          <li>We may delete or anonymize your account data (subject to retention obligations)</li>
          <li>Outstanding fees become immediately due and payable</li>
          <li>Ongoing procurement processes may be suspended or transferred</li>
          <li>Contract performance obligations continue until fulfillment</li>
          <li>Intellectual property licenses terminate</li>
          <li>Confidentiality and indemnification obligations survive termination</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">13. Dispute Resolution</h2>
        
        <h3 className="mt-4 text-xl font-semibold">13.1 Governing Law</h3>
        <p>
          These Terms are governed by and construed in accordance with the laws of the Republic of Kenya, 
          without regard to conflict of law principles. The United Nations Convention on Contracts for the 
          International Sale of Goods does not apply.
        </p>

        <h3 className="mt-4 text-xl font-semibold">13.2 Mandatory Arbitration</h3>
        <p>
          Any dispute, controversy, or claim arising out of or relating to these Terms, or the breach, termination, 
          or invalidity thereof, shall be resolved through binding arbitration rather than litigation, except as noted below.
        </p>
        <ul>
          <li><strong>Arbitration Forum:</strong> Nairobi Centre for International Arbitration (NCIA)</li>
          <li><strong>Arbitration Rules:</strong> NCIA Arbitration Rules (current version)</li>
          <li><strong>Number of Arbitrators:</strong> One arbitrator mutually agreed, or appointed by NCIA</li>
          <li><strong>Language:</strong> English</li>
          <li><strong>Seat of Arbitration:</strong> Nairobi, Kenya</li>
          <li><strong>Costs:</strong> Each party bears own costs unless arbitrator determines otherwise</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">13.3 Exceptions to Arbitration</h3>
        <p>Either party may seek equitable relief in court for:</p>
        <ul>
          <li>Intellectual property infringement</li>
          <li>Breach of confidentiality obligations</li>
          <li>Emergency injunctive relief</li>
          <li>Small claims court matters (below KES 500,000)</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">13.4 Class Action Waiver</h3>
        <p>
          YOU AGREE THAT DISPUTES WILL BE RESOLVED ON AN INDIVIDUAL BASIS ONLY. YOU WAIVE ANY RIGHT TO PARTICIPATE 
          IN CLASS ACTION LAWSUITS, CLASS-WIDE ARBITRATION, OR REPRESENTATIVE ACTIONS AGAINST PROCURECHAIN.
        </p>

        <h3 className="mt-4 text-xl font-semibold">13.5 Negotiation Requirement</h3>
        <p>
          Before initiating arbitration, parties agree to attempt good faith negotiation for 30 days. Either party 
          may initiate negotiations by sending written notice describing the dispute.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">14. Miscellaneous Provisions</h2>
        
        <h3 className="mt-4 text-xl font-semibold">14.1 Entire Agreement</h3>
        <p>
          These Terms, together with the Privacy Policy, Cookie Policy, and any applicable commercial agreements 
          or SLAs, constitute the entire agreement between you and ProcureChain regarding the Platform and supersede 
          all prior agreements, representations, and understandings, whether written or oral.
        </p>

        <h3 className="mt-4 text-xl font-semibold">14.2 Severability</h3>
        <p>
          If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent 
          jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision shall 
          be modified to the minimum extent necessary to make it valid and enforceable.
        </p>

        <h3 className="mt-4 text-xl font-semibold">14.3 Waiver</h3>
        <p>
          No waiver of any provision of these Terms shall be deemed a further or continuing waiver of that provision 
          or any other provision. Our failure to assert any right or provision under these Terms does not constitute 
          a waiver of that right or provision.
        </p>

        <h3 className="mt-4 text-xl font-semibold">14.4 Assignment</h3>
        <p>
          You may not assign, transfer, or delegate your rights or obligations under these Terms without our prior 
          written consent. We may assign these Terms without restriction, including in connection with mergers, 
          acquisitions, or asset sales.
        </p>

        <h3 className="mt-4 text-xl font-semibold">14.5 Force Majeure</h3>
        <p>
          We shall not be liable for any failure or delay in performance due to causes beyond our reasonable control, 
          including acts of God, natural disasters, war, terrorism, riots, civil unrest, government restrictions, 
          pandemics, labor disputes, or telecommunications failures.
        </p>

        <h3 className="mt-4 text-xl font-semibold">14.6 Notices</h3>
        <p>Legal notices must be sent to:</p>
        <ul>
          <li><strong>Email:</strong> legal@procurechain.co.ke</li>
          <li><strong>Address:</strong> ProcureChain Kenya Limited, Westlands Office Park, Waiyaki Way, Nairobi, Kenya</li>
        </ul>
        <p>Notices are deemed received when confirmed by email or 3 business days after posting by courier.</p>

        <h3 className="mt-4 text-xl font-semibold">14.7 Survival</h3>
        <p>
          The following provisions survive termination: Intellectual Property Rights, Confidentiality, Indemnification, 
          Limitation of Liability, Dispute Resolution, and any provisions that by their nature should survive.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">15. Contact Information</h2>
        
        <p>For questions, concerns, or notices regarding these Terms or the Platform, contact us at:</p>
        
        <div className="bg-secondary/20 p-4 rounded-lg">
          <p className="mb-2"><strong>ProcureChain Kenya Limited</strong></p>
          <p><strong>Registered Office:</strong> Westlands Office Park, Waiyaki Way, Nairobi, Kenya</p>
          <p><strong>Business Registration:</strong> PVT-XXXXXXX</p>
          <p className="mt-3"><strong>Contact Channels:</strong></p>
          <p>General Inquiries: support@procurechain.co.ke</p>
          <p>Legal/Terms: legal@procurechain.co.ke</p>
          <p>Privacy/Data: privacy@procurechain.co.ke</p>
          <p>Enterprise Services: enterprise@procurechain.co.ke</p>
          <p>Technical Support: tech@procurechain.co.ke</p>
          <p className="mt-2">Phone: +254 700 000 000</p>
          <p>WhatsApp: +254 700 000 001</p>
          <p>Working Hours: Monday-Friday, 8:00 AM - 5:00 PM EAT</p>
        </div>

        <div className="mt-12 p-6 bg-red-50 border-l-4 border-l-red-500 rounded">
          <p className="font-semibold mb-2">IMPORTANT ACKNOWLEDGMENT</p>
          <p className="text-sm">
            By clicking "I Accept," "I Agree," creating an account, or continuing to use the Platform, you acknowledge that:
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>• You have read and understood these Terms of Service in their entirety</li>
            <li>• You agree to be legally bound by these Terms</li>
            <li>• You have authority to enter this agreement (personally or on behalf of your organization)</li>
            <li>• You understand the liability limitations and dispute resolution procedures</li>
            <li>• You consent to electronic communications and notifications</li>
          </ul>
          <p className="text-sm mt-3 font-semibold">
            If you do not agree to these Terms, you must immediately cease using the Platform and may not access any Platform features or services.
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="font-semibold text-blue-800">Version History & Changes</p>
          <p className="text-sm text-blue-700 mt-2">
            This is Version 1.0 of our Terms of Service, effective {effectiveDate}. We maintain a version history 
            of material changes. To view previous versions or change logs, visit procurechain.co.ke/legal/terms-history
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
