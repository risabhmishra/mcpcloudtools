# MCPCloudTools POC

This is a standalone version of the MCPCloudTools Proof of Concept (POC) page, extracted from the main MCPCloudTools project. It demonstrates a Tools-as-a-Service platform for agentic AI built on the Model Context Protocol.

## Features

- Dynamic tool discovery for AI systems
- Automated tool creation from cURL commands
- Seamless integration with MCP-compatible clients
- Simple and intuitive UI for managing tools

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend Requirements

This frontend application expects a backend server running at `http://localhost:8000` with the following endpoints:

- `GET /tools` - Retrieves all registered tools
- `POST /register_tool` - Registers a new tool

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components

## License

This project is part of the MCPCloudTools suite.
