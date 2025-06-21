// File: app/layout.js
// Description: The root layout for the App Router. It replaces _app.js and _document.js.

import { Inter } from 'next/font/google';
import './globals.css';

// Optimized font loading with next/font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Metadata for the site (replaces next/head)
export const metadata = {
  title: 'BuildEasy - Buat Website Impianmu',
  description: 'Generate a portfolio or company website with a single prompt.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
