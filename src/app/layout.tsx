import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/ui/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MCPCloudTools - Tools-as-a-Service for AI Agents",
  description: "Create and deploy tools that extend what LLMs and AI agents can accomplish with the Model Context Protocol",
  keywords: "MCPCloudTools, Model Context Protocol, AI tools, LLM tools, agentic AI",
  authors: [{ name: "MCPCloudTools Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} bg-background text-foreground antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 p-4 md:p-8">
              {children}
            </main>
            <footer className="border-t border-border py-6 md:py-8">
              <div className="container px-4 md:px-6">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-5">
                    <p className="text-sm text-foreground/80">
                      &copy; {new Date().getFullYear()} MCPCloudTools. All rights reserved.
                    </p>
                  </div>
                  
                  <div className="col-span-6 md:col-span-4">
                    <h3 className="text-sm font-medium mb-2">Contact Us</h3>
                    <a href="mailto:risabh@mcpcloudtools.com" className="block text-sm text-foreground/80 hover:text-foreground">
                      risabh@mcpcloudtools.com
                    </a>
                    <a href="mailto:nischay@mcpcloudtools.com" className="block text-sm text-foreground/80 hover:text-foreground">
                      nischay@mcpcloudtools.com
                    </a>
                  </div>
                  
                  <div className="col-span-6 md:col-span-3">
                    <h3 className="text-sm font-medium mb-2">Links</h3>
                    <div className="flex flex-col space-y-1">
                      <a href="/contact" className="text-sm text-foreground/80 hover:text-foreground">Contact</a>
                      <a href="/privacy" className="text-sm text-foreground/80 hover:text-foreground">Privacy</a>
                      <a href="/terms" className="text-sm text-foreground/80 hover:text-foreground">Terms</a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
