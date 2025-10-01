
import React from 'react';

const Privacy = () => {
  const lastUpdated = "October 1, 2025";

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="prose prose-lg max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>

        <p>
          ProcureChain ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">1. Information We Collect</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect on the platform includes:
        </p>
        <ul>
          <li>
            <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the platform or when you choose to participate in various activities related to the platform, such as online chat and message boards.
          </li>
          <li>
            <strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the platform.
          </li>
          <li>
            <strong>Data from Social Networks:</strong> User information from social networking sites, such as [Facebook, Twitter, etc.], including your name, your social network username, location, gender, birth date, email address, profile picture, and public data for contacts, if you connect your account to such social networks.
          </li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">2. How We Use Your Information</h2>
        <p>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the platform to:
        </p>
        <ul>
          <li>Create and manage your account.</li>
          <li>Process your transactions and send you related information, including purchase confirmations and invoices.</li>
          <li>Email you regarding your account or order.</li>
          <li>Enable user-to-user communications.</li>
          <li>Fulfill and manage purchases, orders, payments, and other transactions related to the platform.</li>
          <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
        </ul>
        
        <h2 className="mt-8 text-2xl font-semibold">3. Disclosure of Your Information</h2>
        <p>
          We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
        </p>
        <ul>
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">4. Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>
        
        <h2 className="mt-8 text-2xl font-semibold">5. Your Data Protection Rights</h2>
        <p>
          Depending on your location, you may have the following rights regarding your personal data:
        </p>
        <ul>
            <li>The right to access – You have the right to request copies of your personal data.</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
        </ul>
        
        <h2 className="mt-8 text-2xl font-semibold">6. Data Retention and Deletion</h2>
        <p>
          We retain your personal data for as long as necessary to provide our services and comply with legal obligations:
        </p>
        <ul>
          <li><strong>Procurement Records:</strong> 7 years from contract completion (as required by Kenya PPRA regulations)</li>
          <li><strong>Blockchain Transactions:</strong> Immutable records stored indefinitely for audit and transparency purposes</li>
          <li><strong>Account Data:</strong> Until account deletion or 2 years after last activity</li>
          <li><strong>Audit Logs:</strong> 10 years for compliance and legal requirements</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">7. Blockchain and Data Immutability</h2>
        <p>
          ProcureChain uses Hyperledger Fabric blockchain technology to ensure transparency and immutability of procurement transactions. You acknowledge that:
        </p>
        <ul>
          <li>Transaction hashes and metadata recorded on the blockchain cannot be altered or deleted</li>
          <li>Blockchain records serve as permanent, tamper-proof audit trails</li>
          <li>Personal identifiable information is not directly stored on the blockchain</li>
          <li>Document hashes (not the documents themselves) are recorded for integrity verification</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">8. International Data Transfers</h2>
        <p>
          Your data may be processed and stored in Kenya or other countries where our service providers operate. We ensure appropriate safeguards are in place for international data transfers in accordance with applicable data protection laws.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">9. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to enhance user experience, analyze platform usage, and provide personalized content. You can control cookie preferences through your browser settings.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">10. Third-Party Services</h2>
        <p>
          Our Platform may integrate with third-party services for payment processing, identity verification, and analytics. These third parties have their own privacy policies, and we are not responsible for their data practices.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">11. Children's Privacy</h2>
        <p>
          The Platform is not intended for use by individuals under 18 years of age. We do not knowingly collect personal data from children.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">12. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our Platform and updating the "Last Updated" date. Your continued use of the Platform after changes constitutes acceptance of the updated policy.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">13. Legal Compliance</h2>
        <p>
          This Privacy Policy complies with:
        </p>
        <ul>
          <li>Kenya Data Protection Act, 2019</li>
          <li>Public Procurement and Asset Disposal Act, 2015</li>
          <li>General Data Protection Regulation (GDPR) principles</li>
          <li>International data protection standards</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">14. Contact Us</h2>
        <p>
          If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>
        <div className="bg-secondary/20 p-4 rounded-lg">
          <p className="mb-2">
            <strong>ProcureChain Data Protection Officer</strong>
          </p>
          <p>Email: privacy@procurechain.co.ke</p>
          <p>Support: support@procurechain.co.ke</p>
          <p>Phone: +254 700 000 000</p>
          <p>Address: Nairobi, Kenya</p>
        </div>

        <div className="mt-8 p-6 bg-blue-50 border-l-4 border-l-blue-500 rounded">
          <p className="font-semibold mb-2">Your Rights Matter</p>
          <p className="text-sm">
            We are committed to protecting your privacy and ensuring transparent data practices. If you believe your rights have been violated, you may lodge a complaint with the Office of the Data Protection Commissioner (Kenya) at www.odpc.go.ke
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

