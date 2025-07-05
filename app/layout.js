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

const googleFontsForPreview = [
  // Sans Serif
  'Poppins', 'Lato', 'Roboto', 'Montserrat', 'Open Sans', 'Nunito Sans', 'Work Sans', 'Rubik', 'Manrope', 'DM Sans',
  // Serif
  'Playfair Display', 'Merriweather', 'Lora', 'Cormorant Garamond', 'EB Garamond', 'Prata',
  // Display
  'Oswald', 'Raleway', 'Lobster', 'Pacifico', 'Syne', 'Space Grotesk',
  // Handwriting
  'Caveat', 'Patrick Hand', 'Architects Daughter'
];

// Membuat URL untuk di-import dari Google Fonts
// URL ini akan memuat semua font yang ada di dalam list di atas
const fontQuery = googleFontsForPreview.map(font => `family=${font.replace(/ /g, '+')}`).join('&');
const fontsUrl = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;

// Metadata for the site (replaces next/head)
export const metadata = {
  title: 'BuildEasy - Buat Website Impianmu',
  description: 'Generate a portfolio or company website with a single prompt.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Link untuk preconnect, direkomendasikan oleh Google Fonts untuk performa */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        {/* Link yang memuat semua font untuk preview di dropdown */}
        <link href={fontsUrl} rel="stylesheet" />
      </head>
      <body className="bg-gray-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
