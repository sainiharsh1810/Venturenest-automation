import "./globals.css";
import React from "react";

export const metadata = {
  title: "VentureNest - Mentors Connection Mobile App",
  description: "Mobile App for Startup Mentors & Incubator Advisors to review student submissions and provide guidance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050B14] flex justify-center items-start py-0 md:py-6">
        {/* Mobile Device Frame Mockup container for desktop viewing */}
        <div className="w-full max-w-md h-full md:h-[880px] bg-[#0B192C] md:rounded-[40px] md:border-[8px] md:border-slate-800 shadow-2xl flex flex-col overflow-hidden relative">
          {children}
        </div>
      </body>
    </html>
  );
}
