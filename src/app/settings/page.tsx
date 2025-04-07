'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useSearchParams } from 'next/navigation'
import { 
  Save, 
  Check, 
  AlertCircle
} from 'lucide-react'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ThemeToggle } from '@/components/theme-toggle'
import { RequiresAuth } from '@/components/auth/requires-auth'

// Define form schemas with validation
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

const preferencesSchema = z.object({
  notifications: z.boolean().default(true),
})

type ProfileValues = z.infer<typeof profileSchema>
// Modified type definition to match the Zod schema output
type PreferencesValues = {
  notifications: boolean;
}

function SettingsContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<string>('profile')
  const [profileStatus, setProfileStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [preferencesStatus, setPreferencesStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isLoading, setIsLoading] = useState(true)
  
  // Set the active tab based on URL param
  useEffect(() => {
    if (tabParam && ['profile', 'preferences'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])
  
  useEffect(() => {
    setIsLoading(false)
  }, [])

  // Initialize forms
  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  })
  
  const preferencesForm = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema) as any, // Type assertion to bypass the resolver type error
    defaultValues: {
      notifications: true,
    },
  })
  
  // Form submission handlers
  const onProfileSubmit = async (data: ProfileValues) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Profile updated:', data)
      setProfileStatus('success')
      setTimeout(() => setProfileStatus('idle'), 3000)
    } catch (error) {
      console.error('Profile update error:', error)
      setProfileStatus('error')
    }
  }
  
  const onPreferencesSubmit = async (data: PreferencesValues) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Preferences updated:', data)
      setPreferencesStatus('success')
      setTimeout(() => setPreferencesStatus('idle'), 3000)
    } catch (error) {
      console.error('Preferences update error:', error)
      setPreferencesStatus('error')
    }
  }

  return (
    <div className="container py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              
              {profileStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center mb-6">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Profile updated successfully!</span>
                </div>
              )}
              
              {profileStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center mb-6">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>There was an error updating your profile. Please try again.</span>
                </div>
              )}
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </form>
              </Form>
            </div>
          </Card>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Preferences</h2>
              
              {preferencesStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center mb-6">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Preferences updated successfully!</span>
                </div>
              )}
              
              {preferencesStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center mb-6">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>There was an error updating your preferences. Please try again.</span>
                </div>
              )}
              
              <Form {...preferencesForm}>
                <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit as any)} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Dark Mode</h3>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                    </div>
                    <ThemeToggle />
                  </div>
                  
                  <FormField
                    control={preferencesForm.control as any}
                    name="notifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Notifications</FormLabel>
                          <FormDescription>
                            Receive notifications about tool executions and updates
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </Button>
                </form>
              </Form>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <RequiresAuth>
      <Suspense fallback={<div className="container py-6 max-w-4xl">
        <Skeleton className="h-4 w-64 mb-4" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg mt-4" />
      </div>}>
        <SettingsContent />
      </Suspense>
    </RequiresAuth>
  )
}