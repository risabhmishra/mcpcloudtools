import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-background border-r border-border p-4">
      <div className="text-lg font-bold text-primary mb-4">Navigation</div>
      <nav className="flex flex-col space-y-2">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
          Dashboard
        </Link>
        <Link href="/tools" className="text-muted-foreground hover:text-foreground">
          Tools
        </Link>
        <Link href="/execution-logs" className="text-muted-foreground hover:text-foreground">
          Execution Logs
        </Link>
        <Link href="/settings" className="text-muted-foreground hover:text-foreground">
          Settings
        </Link>
      </nav>
    </aside>
  )
} 