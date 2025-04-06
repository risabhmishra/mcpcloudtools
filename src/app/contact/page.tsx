'use client'

import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// Define form schema with validation
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function ContactPage() {
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  // Initialize form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })
  
  // Form submission handler
  const onSubmit = async (data: ContactFormValues) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', data)
      setSubmissionStatus('success')
      form.reset()
      setTimeout(() => setSubmissionStatus('idle'), 5000)
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmissionStatus('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Reach Out Directly
          </h2>
          <p className="text-foreground/80 mb-6">
            Have questions about MCPCloudTools or need assistance? Feel free to reach out to our team members directly.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Risabh Kumar</h3>
              <a 
                href="mailto:risabh@mcpcloudtools.com" 
                className="text-primary hover:underline flex items-center"
              >
                <Mail className="h-4 w-4 mr-1" />
                risabh@mcpcloudtools.com
              </a>
            </div>
            
            <div>
              <h3 className="font-medium">Nischay Tiwari</h3>
              <a 
                href="mailto:nischay@mcpcloudtools.com" 
                className="text-primary hover:underline flex items-center"
              >
                <Mail className="h-4 w-4 mr-1" />
                nischay@mcpcloudtools.com
              </a>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
          
          {submissionStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              <p>Thank you for your message! We will get back to you shortly.</p>
            </div>
          )}
          
          {submissionStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p>There was an error sending your message. Please try again.</p>
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="What is this regarding?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Your message here..." 
                        className="min-h-[120px] resize-y"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </Form>
        </Card>
      </div>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">About MCPCloudTools</h2>
        <p className="text-foreground/80 mb-4">
          MCPCloudTools is a Tools-as-a-Service (TaaS) platform for agentic AI built on the Model Context Protocol.
          Our platform allows you to extend what your LLMs and AI agents can accomplish through dynamic tool
          discovery and creation.
        </p>
        <p className="text-foreground/80">
          Whether you're looking to build integrations, have questions about our platform, or want to partner
          with us, we'd love to hear from you. Reach out using the form above or contact us directly via email.
        </p>
      </Card>
    </div>
  )
} 