'use client'

import React, { useState, useEffect } from 'react'
import { Check, Copy, AlertCircle, Info, ExternalLink, Search, Sparkles, Puzzle } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

import { toast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

// Define types for form values
type FormValues = {
  curl: string;
  tool_name: string;
  description: string;
}

// Function to validate cURL command
function validateCurl(curlCommand: string): { isValid: boolean; message?: string } {
  // Basic check: must start with curl
  if (!curlCommand.trim().startsWith('curl')) {
    return { isValid: false, message: 'Command must start with "curl"' };
  }
  
  // Enhanced URL detection - handles quoted URLs and various formats
  const urlPatterns = [
    /(https?:\/\/[^\s"']+)/i,                     // Standard URLs without quotes
    /["'](https?:\/\/[^"']+)["']/i,              // URLs in quotes
    /\s([-\w]+\.\w+\.\w+[^\s"']*)/i,            // Domain names without protocol
    /\s(localhost:[0-9]+[^\s"']*)/i               // localhost URLs
  ];
  
  const hasUrl = urlPatterns.some(pattern => pattern.test(curlCommand));
  if (!hasUrl) {
    return { isValid: false, message: 'Command must contain a valid URL or domain' };
  }
  
  // Comprehensive option detection - supports all standard cURL options
  const commonOptions = [
    // HTTP method options
    '-X', '--request',
    // Header options
    '-H', '--header',
    // Data options
    '-d', '--data', '--data-raw', '--data-binary', '--data-urlencode',
    // Form options
    '-F', '--form',
    // Authentication options
    '-u', '--user', '--basic', '--digest',
    // Request options
    '-I', '--head', '-G', '--get',
    // Output options
    '-o', '--output', '-O', '--remote-name',
    // Common flags
    '-v', '--verbose', '-s', '--silent', '-L', '--location'
  ];
  
  // Check if any common option is present
  const hasOption = commonOptions.some(option => 
    curlCommand.includes(` ${option} `) || curlCommand.includes(` ${option}=`)
  );
  
  // Special case: Simple GET request might not have options
  const isSimpleGet = /curl\s+['"]?https?:\/\//.test(curlCommand);
  
  if (!hasOption && !isSimpleGet) {
    return { 
      isValid: false, 
      message: 'Command should include at least one curl option or be a simple GET request' 
    };
  }
  
  return { isValid: true };
}

export default function MCPCloudToolsPOC() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [registeredTools, setRegisteredTools] = useState<any[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [activeTab, setActiveTab] = useState('create')
  const [mcpConfig, setMcpConfig] = useState('')
  const [curlValidation, setCurlValidation] = useState<{ isValid: boolean; message?: string }>({ isValid: true })
  
  // Hardcoded API base URL for direct access
  const apiBaseUrl = 'http://localhost:8000'
  
  // Initialize form state
  const [formValues, setFormValues] = useState<FormValues>({
    curl: '',
    tool_name: '',
    description: ''
  })

  // Fetch registered tools on component mount
  useEffect(() => {
    fetchTools()
  }, [])

  // Fetch tools from the backend
  const fetchTools = async () => {
    try {
      console.log(`Fetching tools from: ${apiBaseUrl}/tools`)
      const response = await fetch(`${apiBaseUrl}/tools`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Received tools data:', data)
      
      if (data.tools) {
        setRegisteredTools(data.tools)
      } else if (data.message === "No tools registered yet.") {
        setRegisteredTools([])
      }
    } catch (error) {
      console.error('Error fetching tools:', error)
      toast({
        title: "Error fetching tools",
        description: `${error}`,
        variant: "destructive"
      })
    }
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus('idle')
    setErrorMessage('')
    
    try {
      console.log(`Submitting tool to: ${apiBaseUrl}/register_tool`)
      console.log('Form values:', formValues)
      
      const response = await fetch(`${apiBaseUrl}/register_tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formValues),
      })
      
      console.log('Response status:', response.status)
      
      const result = await response.json()
      console.log('Response data:', result)
      
      if (response.ok) {
        setFormStatus('success')
        toast({
          title: "Tool registered successfully!",
          description: `${formValues.tool_name} has been added to the tools registry.`,
        })
        
        // Switch to the tools tab
        setActiveTab('tools')
        
        // Refresh the tools list
        fetchTools()
        
        // Reset form
        setFormValues({
          curl: '',
          tool_name: '',
          description: ''
        })
      } else {
        setFormStatus('error')
        setErrorMessage(result.error || 'Failed to register tool')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setFormStatus('error')
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    })
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">MCPCloudTools</h1>
        <p className="text-xl text-muted-foreground mb-3">
          A Tools-as-a-Service platform for <span className="font-bold text-primary">Agentic AI</span> built on the Model Context Protocol
        </p>
        <div className="max-w-2xl mx-auto border-l-4 border-primary pl-4 py-2 bg-primary/5 text-left">
          <p className="text-base text-muted-foreground">
            Extend what your LLMs and AI agents can accomplish through dynamic tool discovery and creation. Create new tools with a simple cURL command or textual description and deploy them instantly.
          </p>
        </div>
      </header>
      
      {/* Platform Features */}
      <div className="mb-8 grid gap-4 md:grid-cols-3 sm:grid-cols-2">
        <div className="flex flex-col p-5 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
          <div className="mb-3 text-primary bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center">
            <Search className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold mb-2">Dynamic Tool Discovery</h3>
          <p className="text-sm text-muted-foreground">AI systems discover and invoke tools from our JSON-formatted catalogue with input/output schemas and metadata.</p>
        </div>
        
        <div className="flex flex-col p-5 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
          <div className="mb-3 text-primary bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold mb-2">Automated Tool Creation</h3>
          <p className="text-sm text-muted-foreground">Create tools from cURL commands or plain-text descriptions. Our system handles validation and standardization.</p>
        </div>
        
        <div className="flex flex-col p-5 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
          <div className="mb-3 text-primary bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center">
            <Puzzle className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold mb-2">Seamless Integration</h3>
          <p className="text-sm text-muted-foreground">Support for both local (stdio) and remote (HTTP/SSE) deployments across any AI environment.</p>
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <Info className="h-5 w-5 mr-2 text-primary" />
          How It Works
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
          <li>Register your API endpoint as a tool using a cURL command or by filling out the form details</li>
          <li>Our system validates your tool and creates a standardized MCP-compatible interface</li>
          <li>AI systems can discover and invoke your tool through the Model Context Protocol</li>
          <li>Monitor usage and performance through our analytics dashboard</li>
        </ol>
      </div>
      
      <Tabs defaultValue="create" value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        // Reset form status when switching tabs
        if (value === 'create') {
          setFormStatus('idle');
        }
        // If switching to tools tab, refresh the tools list
        if (value === 'tools') {
          fetchTools();
        }
      }} className="w-full">
        <div className="bg-background border rounded-md p-1 mb-6">
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'create' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              Create Tool
            </button>
            <button
              onClick={() => {
                setActiveTab('tools');
                fetchTools();
              }}
              className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'tools' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              Registered Tools
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'usage' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              Usage Instructions
            </button>
          </div>
        </div>
        
        {/* Create Tool Tab */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Tool</CardTitle>
              <CardDescription>
                Register a new tool by providing a cURL command, name, and description.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Success Message */}
              {formStatus === 'success' && (
                <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Tool registered successfully. You can view it in the Registered Tools tab.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Error Message */}
              {formStatus === 'error' && (
                <Alert className="mb-6 bg-red-50 text-red-700 border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {errorMessage || 'There was an error registering your tool. Please try again.'}
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                  {/* cURL Command */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">cURL Command</label>
                    <Textarea 
                      placeholder="curl -X GET https://api.example.com/data -H 'Authorization: Bearer token'" 
                      className={`font-mono h-24 ${formValues.curl.length > 0 && !curlValidation.isValid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={formValues.curl}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setFormValues({...formValues, curl: newValue});
                        if (newValue.length > 10) {
                          setCurlValidation(validateCurl(newValue));
                        }
                      }}
                      onBlur={() => {
                        if (formValues.curl.length > 0) {
                          setCurlValidation(validateCurl(formValues.curl));
                        }
                      }}
                    />
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">
                        Enter a valid cURL command that will be converted into an MCP tool.
                      </p>
                      {formValues.curl.length > 0 && (
                        <span className={`text-xs font-medium ${curlValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                          {curlValidation.isValid ? 'Valid cURL' : 'Invalid cURL'}
                        </span>
                      )}
                    </div>
                    {formValues.curl.length > 0 && !curlValidation.isValid && (
                      <p className="text-sm font-medium text-destructive">{curlValidation.message}</p>
                    )}
                  </div>
                  
                  {/* Tool Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tool Name</label>
                    <Input 
                      placeholder="weather_api" 
                      value={formValues.tool_name}
                      onChange={(e) => setFormValues({...formValues, tool_name: e.target.value})}
                    />
                    <p className="text-sm text-muted-foreground">
                      A unique name for your tool (no spaces, use underscores).
                    </p>
                    {formValues.tool_name.length > 0 && formValues.tool_name.length < 3 && (
                      <p className="text-sm font-medium text-destructive">Tool name must be at least 3 characters</p>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Description</label>
                    <Textarea 
                      placeholder="Gets current weather information for a specified location" 
                      className="h-20"
                      value={formValues.description}
                      onChange={(e) => setFormValues({...formValues, description: e.target.value})}
                    />
                    <p className="text-sm text-muted-foreground">
                      A clear description of what your tool does and how to use it.
                    </p>
                    {formValues.description.length > 0 && formValues.description.length < 10 && (
                      <p className="text-sm font-medium text-destructive">Description must be at least 10 characters</p>
                    )}
                  </div>
                  
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || 
                      !curlValidation.isValid || 
                      formValues.curl.length < 10 || 
                      formValues.tool_name.length < 3 || 
                      formValues.description.length < 10}
                    className="w-full"
                  >
                    {isSubmitting ? 'Registering Tool...' : 'Register Tool'}
                  </Button>
                </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Registered Tools Tab */}
        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Registered Tools</CardTitle>
              <CardDescription>
                View all registered tools and their details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {registeredTools.length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No tools registered yet</AlertTitle>
                  <AlertDescription>
                    Create your first tool in the Create Tool tab.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {registeredTools.map((tool, index) => (
                    <Card key={index} className="border border-muted">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <CardDescription>{tool.details?.description || "No description provided"}</CardDescription>
                          </div>
                          <div className="inline-flex items-center rounded-full border border-muted-foreground/20 bg-muted/20 px-2.5 py-0.5 text-xs font-semibold">{tool.details?.method?.toUpperCase() || "API"}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-sm">
                          <div className="font-medium">Endpoint:</div>
                          <code className="bg-muted p-1 rounded text-xs block mt-1 overflow-x-auto">
                            {tool.details?.url || "N/A"}
                          </code>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const config = JSON.stringify({
                              tool_name: tool.name,
                              description: tool.details?.description || "",
                              endpoint: "http://localhost:8000/messages/",
                              transport: "sse"
                            }, null, 2)
                            setMcpConfig(config)
                            setActiveTab('usage')
                          }}
                        >
                          View Config
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Usage Instructions Tab */}
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
              <CardDescription>
                Learn how to integrate your tools with MCP-compatible clients.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mcpConfig ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">MCP Configuration</h3>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                        <code>{mcpConfig}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(mcpConfig)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No tool selected</AlertTitle>
                  <AlertDescription>
                    Register a tool or select an existing tool to view its configuration.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="h-px w-full bg-border my-4" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Integration with Cursor</h3>
                <p className="text-sm text-muted-foreground">
                  To use your tools with Cursor, follow these steps:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Copy the MCP configuration above</li>
                  <li>Open Cursor and go to Settings</li>
                  <li>Navigate to the AI section and find the MCP configuration area</li>
                  <li>Paste your configuration and save</li>
                </ol>
              </div>
              
              <div className="h-px w-full bg-border my-4" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Integration with Windsurf</h3>
                <p className="text-sm text-muted-foreground">
                  To use your tools with Windsurf, follow these steps:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Copy the MCP configuration above</li>
                  <li>Open Windsurf and go to the Tools section</li>
                  <li>Click "Add New Tool" and select "MCP Tool"</li>
                  <li>Paste your configuration and save</li>
                </ol>
              </div>
              
              <div className="h-px w-full bg-border my-4" />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Additional Resources</h3>
                <div className="flex items-center gap-2">
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="https://github.com/microsoft/mcp" target="_blank" rel="noopener noreferrer">
                      MCP Documentation
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* AdSense Placeholder */}
      <div className="mt-8 p-4 border border-dashed border-muted-foreground rounded-md text-center">
        <p className="text-sm text-muted-foreground">AdSense Implementation Placeholder</p>
      </div>
      
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>MCPCloudTools - A Tools-as-a-Service platform for Agentic AI</p>
        <p className="mt-1">© 2025 MCPCloudTools</p>
        <p className="mt-2">Contact us: <a href="mailto:risabh@mcpcloudtools.com" className="text-primary hover:underline">risabh@mcpcloudtools.com</a> | <a href="mailto:nischay@cloudtools.com" className="text-primary hover:underline">nischay@cloudtools.com</a></p>
      </footer>
      
      <Toaster />
    </div>
  )
}
