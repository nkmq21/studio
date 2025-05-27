
"use client"; // Mark as a Client Component, AuthProvider uses client-side hooks

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/components/ui/toaster';
import React from 'react'; // Keep React import

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Note: `export const metadata` is for Server Components.
// For Client Component layouts, you'd typically handle title/meta tags differently.
// This might be ignored or handled by a parent server component if one exists.
// For now, focusing on the runtime error.
// export const metadata: Metadata = {
//   title: 'MotoRent',
//   description: 'Rent your next adventure on two wheels.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The isClient state and useEffect were causing AuthProvider not to wrap children during SSR.
  // AuthProvider itself handles loading state and client-side data fetching.
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider> {/* AuthProvider now always wraps children */}
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
