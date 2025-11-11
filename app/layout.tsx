import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpMentor-X Hire",
  description: "AI-powered recruitment dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}