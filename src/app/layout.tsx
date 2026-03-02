import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Golden Phoenix | Chinese Restaurant | Stratford-upon-Avon',
  description:
    'Authentic Cantonese cuisine in the heart of Stratford-upon-Avon. Traditional flavours crafted with care at 22a Bell Court.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
