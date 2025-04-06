'use client'

import { useState, useEffect } from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Filter, Calendar, Save, Download, RefreshCcw, AlertCircle } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts'
import { RequiresAuth } from '@/components/auth/requires-auth'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Expanded sample dummy data for LLM tool invocations
const dummyLogs = [
  { 
    id: '1',
    timestamp: '2023-11-01T10:30:25Z', 
    tool: 'Weather API Tool', 
    status: 'Success', 
    latency: 120, 
    source: 'ChatGPT-4',
    user: 'john.doe@example.com',
    parameters: '{"location": "New York, NY"}'
  },
  { 
    id: '2',
    timestamp: '2023-11-01T11:15:30Z', 
    tool: 'Image Generator', 
    status: 'Failure', 
    latency: 450, 
    source: 'Claude-3',
    user: 'jane.smith@example.com',
    parameters: '{"prompt": "sunrise over mountains", "style": "realistic"}'
  },
  { 
    id: '3',
    timestamp: '2023-11-01T12:45:10Z', 
    tool: 'Weather API Tool', 
    status: 'Success', 
    latency: 85, 
    source: 'Custom App',
    user: 'john.doe@example.com',
    parameters: '{"location": "San Francisco, CA"}'
  },
  { 
    id: '4',
    timestamp: '2023-11-01T14:20:45Z', 
    tool: 'Text Summarizer', 
    status: 'Success', 
    latency: 210, 
    source: 'Scheduled',
    user: 'system',
    parameters: '{"text": "long article content...", "max_length": 100}'
  },
  { 
    id: '5',
    timestamp: '2023-11-01T15:10:15Z', 
    tool: 'Code Explainer', 
    status: 'Failure', 
    latency: 320, 
    source: 'ChatGPT-4',
    user: 'jane.smith@example.com',
    parameters: '{"code": "function example() { ... }", "detail_level": "high"}'
  },
  { 
    id: '6',
    timestamp: '2023-11-02T09:05:20Z', 
    tool: 'Translation Tool', 
    status: 'Success', 
    latency: 95, 
    source: 'API Direct',
    user: 'system',
    parameters: '{"text": "Hello world", "source": "en", "target": "es"}'
  },
  { 
    id: '7',
    timestamp: '2023-11-02T10:45:35Z', 
    tool: 'Weather API Tool', 
    status: 'Success', 
    latency: 130, 
    source: 'Claude-3',
    user: 'john.doe@example.com',
    parameters: '{"location": "London, UK"}'
  },
  { 
    id: '8',
    timestamp: '2023-11-02T13:20:10Z', 
    tool: 'PDF Parser', 
    status: 'Failure', 
    latency: 520, 
    source: 'ChatGPT-4',
    user: 'jane.smith@example.com',
    parameters: '{"file_url": "https://example.com/document.pdf"}'
  },
]

// Generate chart data from logs
const generateChartData = (logs) => {
  // Group by status
  const statusCounts = logs.reduce((acc, log) => {
    acc[log.status] = (acc[log.status] || 0) + 1;
    return acc;
  }, {});
  
  return Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));
};

// Create date filter options
const getDateRangeOptions = () => [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: 'week' },
  { label: 'Last 30 days', value: 'month' },
  { label: 'Custom range', value: 'custom' }
];

export default function ExecutionLogsPage() {
  const [logs, setLogs] = useState(dummyLogs)
  const [filteredLogs, setFilteredLogs] = useState(dummyLogs)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [toolFilter, setToolFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [dateRange, setDateRange] = useState('week')
  const [chartData, setChartData] = useState([])
  const [savedFilters, setSavedFilters] = useState([
    { name: 'Failed ChatGPT-4 Invocations', toolFilter: 'All', statusFilter: 'Failure', sourceFilter: 'ChatGPT-4' },
    { name: 'Weather Tool Usage', toolFilter: 'Weather API Tool', statusFilter: 'All', sourceFilter: 'All' }
  ])
  
  // Get unique tools for filter
  const tools = ['All', ...new Set(dummyLogs.map(log => log.tool))]
  // Get unique sources for filter
  const sources = ['All', ...new Set(dummyLogs.map(log => log.source))]
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [search])
  
  // Update chart data when filtered logs change
  useEffect(() => {
    setChartData(generateChartData(filteredLogs));
  }, [filteredLogs]);
  
  // Filter logs based on search and filters
  useEffect(() => {
    let result = [...dummyLogs]
    
    // Apply tool filter
    if (toolFilter !== 'All') {
      result = result.filter(log => log.tool === toolFilter)
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(log => log.status === statusFilter)
    }
    
    // Apply source filter
    if (sourceFilter !== 'All') {
      result = result.filter(log => log.source === sourceFilter)
    }
    
    // Apply date range filter (simplified implementation)
    // In a real app, this would use proper date filtering
    if (dateRange === 'today') {
      result = result.filter(log => log.timestamp.includes('2023-11-02'))
    } else if (dateRange === 'yesterday') {
      result = result.filter(log => log.timestamp.includes('2023-11-01'))
    }
    
    // Apply search
    if (debouncedSearch) {
      result = result.filter(log => 
        log.tool.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        log.source.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        log.user.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        log.parameters.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }
    
    setFilteredLogs(result)
  }, [debouncedSearch, toolFilter, statusFilter, sourceFilter, dateRange])
  
  // Format timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }
  
  // Save current filter
  const saveCurrentFilter = () => {
    const newFilter = {
      name: `Filter ${savedFilters.length + 1}`,
      toolFilter,
      statusFilter,
      sourceFilter
    }
    setSavedFilters([...savedFilters, newFilter])
  }
  
  // Load saved filter
  const loadFilter = (filter) => {
    setToolFilter(filter.toolFilter)
    setStatusFilter(filter.statusFilter)
    setSourceFilter(filter.sourceFilter)
  }

  return (
    <RequiresAuth>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Tool Invocation Logs</h1>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100 border border-amber-200 dark:border-amber-800">
                Preview
              </span>
            </div>
            <p className="text-muted-foreground">Track and analyze how LLMs are using your tools</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <RefreshCcw size={14} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download size={14} />
              Export
            </Button>
          </div>
        </div>
        
        <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-600 dark:text-amber-400">
            This is a preview of the MCPCloudTools platform. Monitor how various LLMs invoke your published tools.
          </AlertDescription>
        </Alert>
        
        {/* Analytics Card */}
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-medium mb-3">Invocation Summary</h2>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === 'Success' ? '#4caf50' : '#f44336'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Search and Filters */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by tool, source, user, or parameters..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select 
                className="bg-background border rounded flex-1 px-2 py-1 text-sm"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {getDateRangeOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Tool Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                className="bg-background border rounded flex-1 px-2 py-1 text-sm"
                value={toolFilter}
                onChange={(e) => setToolFilter(e.target.value)}
              >
                {tools.map(tool => (
                  <option key={tool} value={tool}>{tool}</option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                className="bg-background border rounded flex-1 px-2 py-1 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Success">Success</option>
                <option value="Failure">Failure</option>
              </select>
            </div>
            
            {/* Source Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                className="bg-background border rounded flex-1 px-2 py-1 text-sm"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            
            {/* Save Filter Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center justify-center gap-1"
              onClick={saveCurrentFilter}
            >
              <Save size={14} />
              Save Filter
            </Button>
          </div>
          
          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Saved filters:</span>
              {savedFilters.map((filter, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  size="sm"
                  onClick={() => loadFilter(filter)}
                >
                  {filter.name}
                </Button>
              ))}
            </div>
          )}
        </Card>
        
        {/* Result Summary */}
        <div className="text-sm text-muted-foreground mb-2">
          Showing {filteredLogs.length} of {dummyLogs.length} logs
        </div>
        
        {/* Logs Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Tool</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Source LLM</TableCell>
              <TableCell>Latency (ms)</TableCell>
              <TableCell>Parameters</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDate(log.timestamp)}</TableCell>
                  <TableCell>{log.tool}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={log.status === 'Success' ? 'success' : 'danger'}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.source}</TableCell>
                  <TableCell>{log.latency}</TableCell>
                  <TableCell className="font-mono text-xs max-w-xs truncate">
                    {log.parameters}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No invocation logs found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </RequiresAuth>
  )
} 