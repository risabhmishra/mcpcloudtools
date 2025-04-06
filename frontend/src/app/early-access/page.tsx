'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function EarlyAccessPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1000)
    
    // In a real app, you would send this data to your backend
    // await fetch('/api/early-access', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email })
    // })
  }

  return (
    <div className="container px-4 py-12 mx-auto max-w-md">
      <Link href="/" className="inline-flex items-center mb-8 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>
      
      <Card className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-3 text-foreground dark:text-foreground">Get Early Access to MCPCloudTools</h1>
          <p className="text-base text-foreground/80 dark:text-foreground/80">
            Be among the first to experience our Tools-as-a-Service platform for agentic AI when we launch in Q2 2025. Create, deploy, and monetize tools that extend what LLMs and AI agents can accomplish.
          </p>
        </div>
        
        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600 dark:text-green-500 mb-4" />
            <h2 className="text-xl font-bold mb-3 text-foreground dark:text-foreground">Thank You!</h2>
            <p className="text-base text-foreground/80 dark:text-foreground/80 mb-4">
              We've added you to our waitlist for MCPCloudTools. You'll be among the first to access our platform where you can create and deploy tools for LLMs using just cURL commands or plain-text descriptions.
            </p>
            <Button asChild>
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-1 text-foreground dark:text-foreground">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="bg-background text-foreground"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1 text-foreground dark:text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-background text-foreground"
              />
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : 'Request Early Access'}
              </Button>
            </div>
            
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              By submitting this form, you agree to receive updates about MCPCloudTools.
              We respect your privacy and will never share your information.
            </p>
          </form>
        )}
      </Card>
    </div>
  )
} 