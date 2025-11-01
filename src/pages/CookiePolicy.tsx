import React from 'react';
import { Card } from '@/components/ui/card';

const CookiePolicy = () => {
  const lastUpdated = "January 15, 2025";

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="prose prose-lg max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Cookie Policy</h1>
        <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>

        <div className="bg-blue-50 border-l-4 border-l-blue-500 p-4 rounded-lg my-6">
          <p className="font-semibold text-blue-800 mb-2">Understanding Our Use of Cookies</p>
          <p className="text-sm text-blue-700">
            This Cookie Policy explains how ProcureChain uses cookies and similar tracking technologies 
            when you visit our platform. This policy is part of our Privacy Policy.
          </p>
        </div>

        <h2 className="mt-8 text-xl font-semibold">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
          They are widely used to make websites work more efficiently and provide useful information to website owners.
        </p>

        <h2 className="mt-8 text-xl font-semibold">2. Types of Cookies We Use</h2>

        <h3 className="mt-4 text-lg font-semibold">2.1 Strictly Necessary Cookies</h3>
        <p>
          These cookies are essential for the platform to function properly. They enable core functionality such as 
          security, network management, and accessibility. You cannot opt-out of these cookies.
        </p>
        <Card className="p-4 my-4">
          <ul className="text-sm space-y-2">
            <li><strong>Authentication Cookies:</strong> Keep you logged in as you navigate the platform</li>
            <li><strong>Security Cookies:</strong> Detect authentication abuse and protect user accounts</li>
            <li><strong>Session Cookies:</strong> Store your temporary session data</li>
            <li><strong>Load Balancing Cookies:</strong> Route your requests to the correct server</li>
          </ul>
        </Card>

        <h3 className="mt-4 text-lg font-semibold">2.2 Functional Cookies</h3>
        <p>
          These cookies enable enhanced functionality and personalization, such as remembering your preferences 
          and settings. They may be set by us or by third-party providers.
        </p>
        <Card className="p-4 my-4">
          <ul className="text-sm space-y-2">
            <li><strong>Preference Cookies:</strong> Remember your language, currency, and display preferences</li>
            <li><strong>User Interface Cookies:</strong> Remember your dashboard layout and customizations</li>
            <li><strong>Notification Cookies:</strong> Remember your notification settings</li>
          </ul>
        </Card>

        <h3 className="mt-4 text-lg font-semibold">2.3 Analytics Cookies</h3>
        <p>
          These cookies help us understand how visitors interact with our platform by collecting and reporting 
          information anonymously. We use this information to improve our services.
        </p>
        <Card className="p-4 my-4">
          <ul className="text-sm space-y-2">
            <li><strong>Google Analytics:</strong> Track page views, session duration, and user behavior</li>
            <li><strong>Performance Monitoring:</strong> Measure page load times and identify bottlenecks</li>
            <li><strong>Error Tracking:</strong> Detect and log technical errors for resolution</li>
          </ul>
        </Card>

        <h3 className="mt-4 text-lg font-semibold">2.4 Marketing Cookies</h3>
        <p>
          These cookies track your online activity to help us deliver more relevant advertising or to limit how 
          many times you see an advertisement. We only use these with your explicit consent.
        </p>
        <Card className="p-4 my-4">
          <ul className="text-sm space-y-2">
            <li><strong>Advertising Cookies:</strong> Show you relevant ads based on your interests</li>
            <li><strong>Retargeting Cookies:</strong> Display ads for services you've shown interest in</li>
            <li><strong>Social Media Cookies:</strong> Enable sharing content on social platforms</li>
          </ul>
        </Card>

        <h2 className="mt-8 text-xl font-semibold">3. First-Party vs. Third-Party Cookies</h2>
        
        <h3 className="mt-4 text-lg font-semibold">3.1 First-Party Cookies</h3>
        <p>
          These are cookies set directly by ProcureChain. We have full control over these cookies and how they're used.
        </p>

        <h3 className="mt-4 text-lg font-semibold">3.2 Third-Party Cookies</h3>
        <p>
          These are cookies set by our trusted partners and service providers. Third-party cookies we may use include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
          <li><strong>Supabase:</strong> For authentication and session management</li>
          <li><strong>Stripe:</strong> For payment processing (only when making payments)</li>
          <li><strong>Content Delivery Networks (CDN):</strong> For faster content delivery</li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold">4. Cookie Lifespan</h2>
        
        <h3 className="mt-4 text-lg font-semibold">4.1 Session Cookies</h3>
        <p>
          These temporary cookies are deleted when you close your browser. They help maintain your session 
          while you navigate the platform.
        </p>

        <h3 className="mt-4 text-lg font-semibold">4.2 Persistent Cookies</h3>
        <p>
          These cookies remain on your device for a set period or until you delete them. They help us recognize 
          you when you return to the platform.
        </p>
        <Card className="p-4 my-4 bg-secondary/20">
          <p className="text-sm"><strong>Typical Lifespan:</strong></p>
          <ul className="text-sm space-y-1 mt-2">
            <li>• Authentication cookies: 30 days</li>
            <li>• Preference cookies: 1 year</li>
            <li>• Analytics cookies: 2 years</li>
            <li>• Marketing cookies: 90 days (with consent)</li>
          </ul>
        </Card>

        <h2 className="mt-8 text-xl font-semibold">5. How to Manage Cookies</h2>
        
        <h3 className="mt-4 text-lg font-semibold">5.1 Browser Settings</h3>
        <p>
          Most web browsers allow you to control cookies through their settings. You can set your browser to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Block all cookies</li>
          <li>Block third-party cookies only</li>
          <li>Delete cookies when you close your browser</li>
          <li>Notify you before a cookie is stored</li>
        </ul>

        <h3 className="mt-4 text-lg font-semibold">5.2 Platform Cookie Preferences</h3>
        <p>
          You can manage your cookie preferences directly on our platform through the Cookie Consent banner 
          that appears on your first visit. You can change your preferences at any time by clicking the 
          "Cookie Settings" link in the footer.
        </p>

        <h3 className="mt-4 text-lg font-semibold">5.3 Impact of Disabling Cookies</h3>
        <div className="bg-yellow-50 border-l-4 border-l-yellow-500 p-4 rounded-lg my-4">
          <p className="font-semibold text-yellow-800 mb-2">⚠️ Important Note</p>
          <p className="text-sm text-yellow-700">
            Disabling certain cookies may limit your ability to use some features of the platform. 
            For example, disabling authentication cookies will prevent you from logging in.
          </p>
        </div>

        <h2 className="mt-8 text-xl font-semibold">6. Specific Browser Instructions</h2>
        
        <Card className="p-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-2">Google Chrome:</p>
              <p>Settings → Privacy and Security → Cookies and other site data</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Mozilla Firefox:</p>
              <p>Settings → Privacy & Security → Cookies and Site Data</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Safari:</p>
              <p>Preferences → Privacy → Manage Website Data</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Microsoft Edge:</p>
              <p>Settings → Cookies and site permissions → Cookies</p>
            </div>
          </div>
        </Card>

        <h2 className="mt-8 text-xl font-semibold">7. Mobile Devices</h2>
        <p>
          For mobile devices, you can manage cookies through your device settings or the browser app settings. 
          Each mobile browser has different processes for managing cookies.
        </p>

        <h2 className="mt-8 text-xl font-semibold">8. Do Not Track Signals</h2>
        <p>
          Some browsers support "Do Not Track" signals. Currently, there is no industry standard for responding 
          to Do Not Track signals. Our platform does not respond to Do Not Track signals at this time, but we 
          will review our policy as industry standards develop.
        </p>

        <h2 className="mt-8 text-xl font-semibold">9. Updates to This Cookie Policy</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in technology, legislation, 
          or our business practices. We will notify you of any material changes by:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Updating the "Last Updated" date at the top of this policy</li>
          <li>Posting a notice on our platform</li>
          <li>Sending an email notification (for significant changes)</li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold">10. Contact Us About Cookies</h2>
        <p>
          If you have questions or concerns about our use of cookies, please contact us:
        </p>
        <Card className="p-4 my-4 bg-secondary/20">
          <p className="text-sm"><strong>Data Protection Officer</strong></p>
          <p className="text-sm">ProcureChain Kenya Limited</p>
          <p className="text-sm">Email: privacy@procurechain.co.ke</p>
          <p className="text-sm">Phone: +254 (0) 20 123 4567</p>
          <p className="text-sm">Address: Nairobi, Kenya</p>
        </Card>

        <div className="bg-green-50 border-l-4 border-l-green-500 p-4 rounded-lg my-6">
          <p className="font-semibold text-green-800 mb-2">Your Cookie Choices Matter</p>
          <p className="text-sm text-green-700">
            We respect your privacy choices. You can adjust your cookie preferences at any time through 
            your browser settings or our Cookie Consent tool. Essential cookies will remain active to 
            ensure platform functionality.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            This Cookie Policy is part of our <a href="/privacy" className="text-primary underline">Privacy Policy</a> 
            {' '}and <a href="/terms" className="text-primary underline">Terms of Service</a>. 
            By using our platform, you consent to our use of cookies as described in this policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
