# MCPCloudTools Documentation

## Project Overview

MCPCloudTools is a modern web application built with Next.js 14 and shadcn/ui components. It provides a comprehensive interface for managing cloud-based tools, monitoring their execution, and configuring user preferences.

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Data Visualization**: Recharts
- **State Management**: React hooks
- **TypeScript**: Full type safety throughout the application

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # Dashboard page with analytics
│   ├── tools/           # Tools listing and creation
│   ├── execution-logs/  # Execution logs viewer
│   ├── settings/        # User settings
│   └── layout.tsx       # Root layout with navigation
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── providers.tsx    # Context providers
│   └── theme-toggle.tsx # Dark mode toggle
├── lib/                 # Utility functions and helpers
├── hooks/               # Custom React hooks
└── styles/              # Global styles
```

## Features

### Navigation & Layout

- **Responsive Navbar**: Top navigation with links to main sections
- **Theme Toggle**: Switch between light and dark mode
- **Centralized Layout**: Consistent structure across all pages

### Home Page

- **Coming Soon Design**: Modern, responsive placeholder
- **Email Signup**: Form for early access with validation
- **Visual Effects**: Animated elements and gradient backgrounds

### Dashboard

- **Interactive Analytics**: Dynamic charts showing tool performance
- **Key Metrics**: Enhanced cards with trend indicators and icons
- **Data Visualization**: Bar charts, line charts, and pie charts
- **Responsive Layout**: Adapts to different screen sizes
- **Loading States**: Animated skeletons for better user experience

### Tools Management

- **Enhanced Tools Table**: Rich tool listing with detailed information
- **Grid/Table Views**: Toggle between different visualization modes
- **Advanced Filtering**: Filter by category, type, and status
- **Search**: Full-text search across tool properties and tags
- **Tag System**: Visual tag display for better categorization
- **Tool Actions**: Run, edit, duplicate, and delete capabilities
- **Creation Form**: Comprehensive form for adding new tools
- **State Management**: Real-time UI updates for tool status changes

### Execution Logs

- **Advanced Log Viewer**: Detailed execution history
- **Multi-criteria Filtering**: Filter by tool, status, source, and date range
- **Visualization**: Chart showing success/failure distribution
- **Saved Filters**: Save and reuse common filters
- **Search**: Search across multiple log properties
- **Export**: Download logs for offline analysis
- **Status Badges**: Visual indicators for execution status

### Settings

- **Profile Information**: User details management
- **Preferences**: Configure application behavior
- **Form Validation**: Input validation with error feedback
- **Tabs Interface**: Organized settings sections

### Teams (`/teams`)

- **Team Management**: Create and manage multiple teams
- **Member Management**: Invite, remove and change roles of team members
- **Role-based Access**: Control permissions with admin, editor, and viewer roles
- **Invitations**: Track and manage pending team invitations
- **Team Settings**: Update team information or delete teams

## UI Components

### Custom Components

- **Card**: Container component for content sections
- **Badge**: Status indicators with color coding
- **Table**: Data display with header and body sections
- **Skeleton**: Loading state placeholders
- **ThemeToggle**: Switch between light and dark themes
- **StatCard**: Enhanced statistics display with trends

### Visualization Components

- **BarChart**: Visualize comparative data
- **LineChart**: Display trends over time
- **PieChart**: Show data distribution
- **ResponsiveContainer**: Ensure charts adapt to screen size

### Forms and Inputs

- **Input**: Text input fields with validation
- **TextArea**: Multi-line text input
- **Select**: Dropdown selection
- **Switch**: Toggle controls
- **Form**: Form component with validation integration

## Theme System

- **Dark/Light Modes**: Complete theme support with system preference detection
- **Color Schemes**: Consistent color palette across components
- **Animations**: Smooth transitions between theme changes

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd mcpcloudtools

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Access the application at `http://localhost:3000`.

## Page Details

### Dashboard (`/dashboard`)

Enhanced dashboard with interactive visualizations:
- **Stat Cards**: Tools Registered, Executions Today, System Uptime, Avg Latency
- **Execution History**: Bar chart showing executions and failures by day
- **Latency Analysis**: Line chart showing latency by tool
- **Tool Usage**: Pie chart showing distribution of tool usage

### Tools (`/tools`)

Advanced tool management interface:
- **Dual View**: Toggle between table and grid views
- **Multi-criteria Filtering**: Category, type, and status filters
- **Rich Search**: Search across tool name, description, and tags
- **Tool Cards**: Detailed information with action buttons
- **Tool Tags**: Visual representation of tool categories
- **Bulk Actions**: Quick access to common tool operations

### Tool Submission (`/tools/submit`)

Form for adding new tools with fields:
- **Tool Name**: Unique identifier
- **Description**: Detailed explanation of tool functionality
- **Endpoint URL or Command**: How to invoke the tool
- **Tool Type**: API, CLI, Function
- **Category**: Tool classification
- **Tags**: Searchable keywords

### Execution Logs (`/execution-logs`)

Comprehensive log viewing and analysis:
- **Execution Summary**: Chart showing success/failure distribution
- **Advanced Filtering**: Tool, status, source, and date range filters
- **Saved Filters**: Save commonly used filter combinations
- **Search**: Find logs by tool, source, or user
- **Export**: Download logs for offline analysis
- **Detailed View**: Complete execution information including user and latency

### Settings (`/settings`)

User and system configuration:
- **Profile Information**: Name, email, and account details
- **Preferences**: Theme settings and notification preferences
- **Form Validation**: Input validation with error feedback
- **Tabs Interface**: Organized settings sections

### Teams (`/teams`)

- **Team Management**: Create and manage multiple teams
- **Member Management**: Invite, remove and change roles of team members
- **Role-based Access**: Control permissions with admin, editor, and viewer roles
- **Invitations**: Track and manage pending team invitations
- **Team Settings**: Update team information or delete teams

## Future Development

The current implementation focuses on the frontend interface and user experience. Future development will include:

- Backend API integration
- Authentication and authorization
- More advanced data visualization
- Enhanced filtering and search capabilities
- Team collaboration features
- Automated tool execution scheduling

## Contributing

This project follows standard contributing guidelines. Please ensure all new features include appropriate tests and documentation. 