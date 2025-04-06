'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  LogOut, 
  Zap, 
  Search, 
  Code, 
  Puzzle, 
  BarChart2,
  Sparkles,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthForms } from '@/components/auth/auth-forms'
import { useAuthStore } from '@/stores/auth-store'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  
  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return null
  }

  // Features list for the homepage
  const features = [
    {
      icon: <Search className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: 'Dynamic Tool Discovery',
      description: 'AI systems discover and invoke tools from our JSON-formatted catalogue with input/output schemas and metadata.'
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: 'Automated Tool Creation',
      description: 'Create tools from cURL commands or plain-text descriptions. Our system handles validation and standardization.'
    },
    {
      icon: <Puzzle className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: 'Seamless Integration',
      description: 'Support for both local (stdio) and remote (HTTP/SSE) deployments across any AI environment.'
    },
    {
      icon: <Code className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: 'Developer SDKs',
      description: 'Comprehensive SDKs for Python, TypeScript, Java and more to facilitate tool creation and integration.'
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: 'Analytics & Monitoring',
      description: 'Track tool usage, performance metrics, and revenue with real-time dashboards and detailed logging.'
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" aria-hidden="true" />,
      title: 'Marketplace Ecosystem',
      description: 'A centralized registry for developers to list, monetize, and update their MCP-compliant tools.'
    }
  ]

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-0 pb-4 md:py-6 lg:py-8 border-b relative" aria-labelledby="hero-heading">
          <div className="container px-4 mx-auto">
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6 items-center">
              <div className="flex flex-col justify-center space-y-3 text-center lg:text-left">
                <div className="space-y-1">
                  <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                    <h1 id="hero-heading" className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-foreground dark:text-foreground">
                      MCPCloudTools
                    </h1>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/70 dark:text-amber-100 border border-amber-200 dark:border-amber-800" aria-label="Coming Soon">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-base font-medium text-foreground dark:text-foreground max-w-[600px] mx-auto lg:mx-0">
                    Tools-as-a-Service (TaaS) platform for <span className="font-bold text-primary dark:text-primary">agentic AI</span> built on the Model Context Protocol
                  </p>
                </div>
                
                <p className="text-base text-foreground/90 dark:text-foreground/90 max-w-[600px] mx-auto lg:mx-0">
                  Extend what your LLMs and AI agents can accomplish through dynamic tool discovery and creation. Create new tools with a simple cURL command or textual description and deploy them instantly.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2">
                  {!isAuthenticated && (
                    <Button asChild size="sm">
                      <Link href="/early-access" onClick={(e) => {
                        if (document.querySelector('#auth-section')) {
                          e.preventDefault();
                          document.querySelector('#auth-section')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}>
                        Get Early Access
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" asChild>
                    <a href="#features-section" onClick={(e) => {
                      e.preventDefault()
                      document.querySelector('#features-section')?.scrollIntoView({ behavior: 'smooth' })
                    }}>
                      Explore Features
                      <ChevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
              
              {isAuthenticated ? (
                <div className="space-y-3 bg-card p-4 rounded-lg border shadow-sm">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-medium">Welcome back, {user?.name}!</p>
                    <p className="text-sm text-foreground/80 dark:text-foreground/80">
                      You're logged in as <span className="font-semibold">{user?.role}</span>
                    </p>
                    <p className="text-sm mt-1 text-amber-600 dark:text-amber-400">
                      Our platform is still in development. You're viewing a preview of our interface.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild size="sm" className="w-full">
                      <Link href="/dashboard">
                        Preview Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={logout} className="w-full">
                      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div id="auth-section" className="bg-card p-4 rounded-lg border shadow-sm" aria-label="Authentication Form">
                  <div className="bg-muted p-4 rounded-lg mb-3">
                    <p className="font-medium">Early Access Preview</p>
                    <p className="text-sm text-foreground/80 dark:text-foreground/80">
                      Our platform is still in development. Sign up below to preview our interface and receive updates when we launch.
                    </p>
                  </div>
                  <AuthForms />
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features-section" className="py-12 md:py-16 bg-muted/30" aria-labelledby="features-heading">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-md bg-primary/20 text-primary">
                Key Features
              </span>
              <h2 id="features-heading" className="text-2xl font-bold md:text-3xl mb-3 text-foreground dark:text-foreground">
                Extend Your AI with Tools-as-a-Service
              </h2>
              <p className="text-base text-foreground/90 dark:text-foreground/90 max-w-[700px] mx-auto">
                MCPCloudTools provides everything needed to discover, create, and deploy tools that dramatically extend what your AI systems can accomplish.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, index) => (
                <div key={index} className="bg-card p-5 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4 p-2 rounded-full bg-primary/20 w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground dark:text-foreground">{feature.title}</h3>
                  <p className="text-base text-foreground/90 dark:text-foreground/90">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 md:py-16 text-center" aria-labelledby="cta-heading">
          <div className="container px-4 mx-auto">
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-md bg-primary/20 text-primary">
                Coming Q2 2025
              </span>
              <h2 id="cta-heading" className="text-2xl font-bold md:text-4xl text-foreground dark:text-foreground mb-3">
                Unleash Truly Agentic AI
              </h2>
              <p className="text-base text-foreground/90 dark:text-foreground/90 mx-auto">
                Join our early access program and be the first to create tools that empower LLMs and AI agents to transcend their native capabilities.
              </p>
              
              {!isAuthenticated && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link href="/early-access" onClick={(e) => {
                      if (document.querySelector('#auth-section')) {
                        e.preventDefault();
                        document.querySelector('#auth-section')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}>
                      Get Early Access
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="https://docs.mcpcloudtools.com" target="_blank" rel="noopener noreferrer">
                      Read Documentation
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
