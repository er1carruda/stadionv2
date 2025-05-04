import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Syncopate } from 'next/font/google';
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/app/components/theme-provider";
import Header from "@/app/components/Header";

const syncopate = Syncopate({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syncopate',
});

export const metadata: Metadata = {
  title: "Stadion",
  description: "Gerenciamento de instalações e instrutores esportivos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          syncopate.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}