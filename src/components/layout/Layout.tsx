
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    // Generate CSRF token on initial load
    if (!sessionStorage.getItem('csrfToken')) {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      sessionStorage.setItem('csrfToken', token);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        {/* Security Headers */}
        <meta http-equiv="Content-Security-Policy" 
          content="default-src 'self'; script-src 'self' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co" />
        <meta http-equiv="X-Content-Type-Options" content="nosniff" />
        <meta http-equiv="X-Frame-Options" content="DENY" />
        <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
        <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), interest-cohort=()" />
        <meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains; preload" />
        <meta name="description" content="ProcureChain - Blockchain-based procurement platform with enterprise-grade security" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/lovable-uploads/2767cbb7-f0e0-4434-a008-9c44991b8a8b.png" />
      </Helmet>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
