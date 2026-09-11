import "./globals.css";
import React from "react";

export const metadata = {
  title: "VentureNest - Admin Dashboard Website",
  description: "System Administration & Operations Portal for VentureNest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0B192C] text-slate-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
