'use client'

import { useState, useEffect } from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  PlusCircle, Search, Filter, Play, 
  Pause, Edit, Trash2, Copy, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { RequiresAuth } from '@/components/auth/requires-auth'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Enhanced dummy data with more fields specific to LLM tools
const dummyData = [
  { 
    id: '1', 
    name: 'Weather API Tool', 
    description: 'Fetches current weather information for any location',
    endpoint: '/api/weather', 
    lastUsed: '2023-10-01', 
    status: 'Active',
    type: 'API',
    category: 'Information Retrieval',
    tags: ['weather', 'api', 'location'],
    creator: 'john.doe@example.com',
    executions: 152,
    avgLatency: 120,
  },
  { 
    id: '2', 
    name: 'Image Generator', 
    description: 'Creates images based on text descriptions',
    endpoint: '/api/image-generation', 
    lastUsed: '2023-09-25', 
    status: 'Inactive',
    type: 'API',
    category: 'Content Generation',
    tags: ['image', 'generation', 'ai'],
    creator: 'jane.smith@example.com',
    executions: 89,
    avgLatency: 320,
  },
  { 
    id: '3', 
    name: 'Data Extract CLI', 
    description: 'Extracts structured data from documents',
    endpoint: 'extract-data --source [path]', 
    lastUsed: '2023-10-05', 
    status: 'Active',
    type: 'CLI',
    category: 'Data Processing',
    tags: ['extract', 'data', 'structured'],
    creator: 'john.doe@example.com',
    executions: 215,
    avgLatency: 95,
  },
  { 
    id: '4', 
    name: 'PDF Parser', 
    description: 'Extracts text and structured data from PDFs',
    endpoint: '/api/pdf-parser', 
    lastUsed: '2023-10-10', 
    status: 'Active',
    type: 'API',
    category: 'Document Processing',
    tags: ['pdf', 'document', 'parser'],
    creator: 'jane.smith@example.com',
    executions: 78,
    avgLatency: 210,
  },
  { 
    id: '5', 
    name: 'Text Summarizer', 
    description: 'Creates concise summaries of lengthy texts',
    endpoint: '/api/summarize', 
    lastUsed: '2023-09-20', 
    status: 'Active',
    type: 'API',
    category: 'Natural Language Processing',
    tags: ['summarize', 'nlp', 'text'],
    creator: 'john.doe@example.com',
    executions: 56,
    avgLatency: 150,
  },
  { 
    id: '6', 
    name: 'Code Explainer', 
    description: 'Explains code snippets in natural language',
    endpoint: '/api/explain-code', 
    lastUsed: '2023-10-15', 
    status: 'Active',
    type: 'API',
    category: 'Developer Tools',
    tags: ['code', 'explanation', 'developer'],
    creator: 'jane.smith@example.com',
    executions: 42,
    avgLatency: 180,
  },
  { 
    id: '7', 
    name: 'Translation Tool', 
    description: 'Translates text between languages',
    endpoint: '/api/translate', 
    lastUsed: '2023-10-08', 
    status: 'Active',
    type: 'API',
    category: 'Natural Language Processing',
    tags: ['translation', 'language', 'nlp'],
    creator: 'john.doe@example.com',
    executions: 120,
    avgLatency: 105,
  }
];

export default function ToolsPage() {
  const [data, setData] = useState(dummyData)
  const [filteredData, setFilteredData] = useState(dummyData)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [isGridView, setIsGridView] = useState(false)
  
  // Get unique categories
  const categories = ['All', ...new Set(dummyData.map(tool => tool.category))]
  
  // Get unique types
  const types = ['All', ...new Set(dummyData.map(tool => tool.type))]
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [search])
  
  // Apply filters
  useEffect(() => {
    let result = [...dummyData]
    
    // Apply category filter
    if (categoryFilter !== 'All') {
      result = result.filter(tool => tool.category === categoryFilter)
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(tool => tool.status === statusFilter)
    }
    
    // Apply type filter
    if (typeFilter !== 'All') {
      result = result.filter(tool => tool.type === typeFilter)
    }
    
    // Apply search
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase()
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.tags.some(tag => tag.includes(searchLower))
      )
    }
    
    setFilteredData(result)
  }, [debouncedSearch, categoryFilter, statusFilter, typeFilter])
  
  // Toggle tool status
  const toggleStatus = (id) => {
    const updatedData = data.map(tool => {
      if (tool.id === id) {
        const newStatus = tool.status === 'Active' ? 'Inactive' : 'Active'
        return { ...tool, status: newStatus }
      }
      return tool
    })
    setData(updatedData)
  }
  
  // Delete tool (just for UI demo - doesn't actually delete)
  const deleteTool = (id) => {
    const updatedData = data.filter(tool => tool.id !== id)
    setData(updatedData)
  }
  
  // Duplicate tool (for demo purposes)
  const duplicateTool = (id) => {
    const toolToDuplicate = data.find(tool => tool.id === id)
    if (toolToDuplicate) {
      const duplicatedTool = {
        ...toolToDuplicate,
        id: `${toolToDuplicate.id}-copy`,
        name: `${toolToDuplicate.name} (Copy)`,
        executions: 0,
        lastUsed: new Date().toISOString().split('T')[0]
      }
      setData([...data, duplicatedTool])
    }
  }

  // Display tags with badges
  const renderTags = (tags) => {
    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300">
            {tag}
          </span>
        ))}
      </div>
    )
  }

  // Grid View for Tools
  const ToolsGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredData.map((tool) => (
        <Card key={tool.id} className="p-4 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{tool.name}</h3>
            <Badge variant={tool.status === 'Active' ? 'success' : 'danger'}>
              {tool.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
          <div className="text-xs text-muted-foreground mb-3">
            <div>Type: <span className="font-medium">{tool.type}</span></div>
            <div>Category: <span className="font-medium">{tool.category}</span></div>
            <div>Executions: <span className="font-medium">{tool.executions}</span></div>
          </div>
          {renderTags(tool.tags)}
          <div className="mt-auto pt-4 flex justify-between">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Play size={14} />
              Run
            </Button>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                <Edit size={14} />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={() => deleteTool(tool.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <RequiresAuth>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">LLM Tools</h1>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100 border border-amber-200 dark:border-amber-800">
                Preview
              </span>
            </div>
            <p className="text-muted-foreground">Discover, create, and manage tools for your LLMs</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsGridView(!isGridView)}
            >
              {isGridView ? 'Table View' : 'Grid View'}
            </Button>
            <Link href="/tools/submit">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create New Tool
              </Button>
            </Link>
          </div>
        </div>
        
        <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-600 dark:text-amber-400">
            This is a preview of the MCPCloudTools platform. Create, manage, and distribute tools for LLMs through our central registry.
          </AlertDescription>
        </Alert>
        
        {/* Search and Filters */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, description, or tags..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                <select 
                  className="bg-background border rounded w-full px-2 py-1 text-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                <select 
                  className="bg-background border rounded w-full px-2 py-1 text-sm"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type === 'All' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                <select 
                  className="bg-background border rounded w-full px-2 py-1 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {data.length} tools
          </div>
        </Card>
        
        {/* Tools Display */}
        {isGridView ? (
          <ToolsGridView />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tool Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Last Used</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-muted-foreground">{tool.description}</div>
                        {renderTags(tool.tags)}
                      </div>
                    </TableCell>
                    <TableCell>{tool.type}</TableCell>
                    <TableCell>{tool.category}</TableCell>
                    <TableCell>{tool.lastUsed}</TableCell>
                    <TableCell>
                      <Badge variant={tool.status === 'Active' ? 'success' : 'danger'}>
                        {tool.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          title={tool.status === 'Active' ? 'Deactivate' : 'Activate'}
                          onClick={() => toggleStatus(tool.id)}
                        >
                          {tool.status === 'Active' ? 
                            <Pause className="h-4 w-4" /> : 
                            <Play className="h-4 w-4" />
                          }
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          title="Duplicate"
                          onClick={() => duplicateTool(tool.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          title="Delete"
                          onClick={() => deleteTool(tool.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No tools found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </RequiresAuth>
  )
} 