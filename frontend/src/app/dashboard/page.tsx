'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts'
import { 
  ArrowUpRight, ArrowDownRight, Zap, Code, Puzzle,
  BarChart2, PieChart as PieChartIcon, Activity,
  Sparkles, Search, AlertCircle
} from 'lucide-react'
import { RequiresAuth } from '@/components/auth/requires-auth'
import { useAuthStore } from '@/stores/auth-store'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Sample data for charts
const executionData = [
  { name: 'Mon', executions: 4, failures: 1 },
  { name: 'Tue', executions: 7, failures: 0 },
  { name: 'Wed', executions: 5, failures: 2 },
  { name: 'Thu', executions: 9, failures: 1 },
  { name: 'Fri', executions: 12, failures: 0 },
  { name: 'Sat', executions: 3, failures: 0 },
  { name: 'Sun', executions: 5, failures: 1 },
];

const latencyData = [
  { name: 'Tools API', value: 120 },
  { name: 'Tool Discovery', value: 320 },
  { name: 'Tool Creation', value: 95 },
  { name: 'Marketplace', value: 210 },
];

const toolUsageData = [
  { name: 'Weather Tools', value: 35 },
  { name: 'Search Tools', value: 25 },
  { name: 'Data Processing', value: 20 },
  { name: 'Text Analysis', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Define types for StatCard props
interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}

// Custom loading placeholder that matches Skeleton dimensions
const CustomSkeleton = () => (
  <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
);

// Reusable StatCard component
const StatCard = ({ title, value, icon, trend, trendValue }: StatCardProps) => {
  const isPositive = trend === 'up';
  
  return (
    <Card>
      <div className="flex justify-between items-start p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          
          {trendValue && (
            <div className={`flex items-center mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span className="text-sm font-medium ml-1">{trendValue}%</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-primary/10">
          {icon}
        </div>
      </div>
    </Card>
  );
};

// Chart components
const ExecutionChart = () => (
  <Card className="p-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium">Tool Invocations</h3>
      <BarChart2 className="text-muted-foreground" size={20} />
    </div>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={executionData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="executions" fill="#8884d8" name="Successful" />
        <Bar dataKey="failures" fill="#ff5252" name="Failed" />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

const LatencyChart = () => (
  <Card className="p-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium">API Latency by Service</h3>
      <Activity className="text-muted-foreground" size={20} />
    </div>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={latencyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Latency (ms)" />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

const ToolUsageChart = () => (
  <Card className="p-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium">Tool Category Distribution</h3>
      <PieChartIcon className="text-muted-foreground" size={20} />
    </div>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={toolUsageData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {toolUsageData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  return (
    <RequiresAuth>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100 border border-amber-200 dark:border-amber-800">
                Preview
              </span>
            </div>
            <p className="text-muted-foreground">Monitor your LLM tools performance and usage</p>
          </div>
          <div className="bg-muted text-sm px-3 py-1 rounded-md">
            Logged in as: <span className="font-medium">{user?.role}</span>
          </div>
        </div>
        
        <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-600 dark:text-amber-400">
            This is a preview of the MCPCloudTools platform. The charts and data shown are for demonstration purposes only.
          </AlertDescription>
        </Alert>
        
        {/* Top stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Tools Registered" 
            value={loading ? <CustomSkeleton /> : "48"} 
            icon={<Puzzle className="text-primary" size={24} />}
            trend="up"
            trendValue="12"
          />
          <StatCard 
            title="Tool Invocations Today" 
            value={loading ? <CustomSkeleton /> : "1,248"} 
            icon={<Zap className="text-primary" size={24} />}
            trend="up"
            trendValue="24"
          />
          <StatCard 
            title="Discovery Latency" 
            value={loading ? <CustomSkeleton /> : "42ms"} 
            icon={<Search className="text-primary" size={24} />}
            trend="down"
            trendValue="8"
          />
          <StatCard 
            title="New Tools Created" 
            value={loading ? <CustomSkeleton /> : "7"} 
            icon={<Sparkles className="text-primary" size={24} />}
            trend="up"
            trendValue="16"
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <ExecutionChart />
          <LatencyChart />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <ToolUsageChart />
        </div>
      </div>
    </RequiresAuth>
  )
} 