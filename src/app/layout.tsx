import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aden Guo - Full Stack Developer & GIS Specialist",
  description: "Portfolio of Aden Guo, a Full Stack Developer and GIS Specialist passionate about creating innovative solutions for spatial data analysis and web applications.",
  keywords: ["Full Stack Developer", "GIS Specialist", "Spatial Data Analysis", "React", "Next.js", "Python", "Machine Learning"],
  authors: [{ name: "Aden Guo" }],
  creator: "Aden Guo",
  publisher: "Aden Guo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Aden Guo - Full Stack Developer & GIS Specialist",
    description: "Portfolio showcasing GIS and web development projects",
    url: 'https://your-domain.com', // Replace with your actual domain
    siteName: 'Aden Guo Portfolio',
    images: [
      {
        url: '/og-image.jpg', // Add an Open Graph image
        width: 1200,
        height: 630,
        alt: 'Aden Guo Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Aden Guo - Full Stack Developer & GIS Specialist",
    description: "Portfolio showcasing GIS and web development projects",
    images: ['/og-image.jpg'], // Add a Twitter image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload CV for faster download */}
        <link rel="preload" href="/cv.pdf" as="document" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//linkedin.com" />
      </head>
      <body>
        {children}
        
        {/* Performance monitoring script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if ('performance' in window) {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                      console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                      console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
                    }
                  }, 0);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
