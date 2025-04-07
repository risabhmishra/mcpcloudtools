'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  BarChart3,
  ScrollText,
  Wrench,
  UserPlus
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useNotificationStore } from '@/stores/notification-store'
import { useAuthStore } from '@/stores/auth-store'

// Interface for navigation items with optional submenus
interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  description?: string
  submenu?: {
    name: string
    href: string
    description?: string
  }[]
  requiresAuth?: boolean
}

// Define navigation items
const navigation: NavItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: <BarChart3 className="h-5 w-5" aria-hidden="true" />,
    description: 'View your LLM tool analytics and metrics',
    requiresAuth: true
  },
  { 
    name: 'Tools', 
    href: '/tools', 
    icon: <Wrench className="h-5 w-5" aria-hidden="true" />,
    description: 'Discover, create and manage LLM tools',
    requiresAuth: true
  },
  { 
    name: 'Invocation Logs', 
    href: '/execution-logs', 
    icon: <ScrollText className="h-5 w-5" aria-hidden="true" />,
    description: 'Track how LLMs are using your tools',
    requiresAuth: true
  },
  {
    name: 'Teams',
    href: '/teams',
    icon: <UserPlus className="h-5 w-5" aria-hidden="true" />,
    description: 'Manage teams and collaborators',
    requiresAuth: true
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: <Settings className="h-5 w-5" aria-hidden="true" />,
    description: 'Configure your account and preferences',
    requiresAuth: true,
    submenu: [
      { name: 'Profile', href: '/settings?tab=profile', description: 'Update your profile information' },
      { name: 'Preferences', href: '/settings?tab=preferences', description: 'Customize your experience' }
    ]
  }
]

export function Navbar() {
  const pathname = usePathname()
  const { unreadCount } = useNotificationStore()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Add scroll effect for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle dropdown toggle
  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  // Check if a nav item should be marked as active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = () => {
    logout()
    setUserDropdownOpen(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null)
      }
      if (userDropdownOpen && !(event.target as Element).closest('.user-dropdown')) {
        setUserDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeDropdown, userDropdownOpen])

  // Filter navigation items based on authentication
  const filteredNavigation = navigation.filter(item => 
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  )

  // Don't render anything during SSR to avoid hydration errors
  if (!mounted) return null

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur transition-shadow ${scrolled ? 'shadow-md' : ''}`} role="banner">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center mr-6">
              <span className="text-xl font-bold text-foreground dark:text-foreground">MCPCloudTools</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1" aria-label="Main navigation">
              {filteredNavigation.map((item) => (
                <div key={item.name} className="relative dropdown-container">
                  {item.submenu ? (
                    <div className="relative">
                      <Button
                        variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center h-10"
                        aria-expanded={activeDropdown === item.name}
                        aria-controls={`dropdown-${item.name}`}
                        aria-haspopup="true"
                      >
                        {item.icon}
                        <span className="mx-2">{item.name}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} aria-hidden="true" />
                      </Button>
                      {activeDropdown === item.name && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-56 rounded-md shadow-lg bg-popover border border-border p-1 z-50"
                          id={`dropdown-${item.name}`}
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby={`dropdown-button-${item.name}`}
                        >
                          {item.submenu.map((subitem) => (
                            <Link 
                              key={subitem.name} 
                              href={subitem.href}
                              className={`block px-4 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground ${pathname === subitem.href ? 'bg-accent text-accent-foreground' : ''}`}
                              onClick={() => setActiveDropdown(null)}
                              role="menuitem"
                              tabIndex={0}
                              aria-label={subitem.description || subitem.name}
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      asChild
                      className="h-10"
                    >
                      <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} aria-label={item.description || item.name}>
                        {item.icon}
                        <span className="ml-2">{item.name}</span>
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            {isAuthenticated && (
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}>
                  <Bell className="h-5 w-5" aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground" aria-hidden="true">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}
            
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* User profile dropdown */}
            {isAuthenticated ? (
              <div className="relative ml-1 user-dropdown">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-8 w-8 ml-1"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  aria-controls="user-dropdown-menu"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt={user?.name || 'User profile'} />
                    <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
                
                {/* Profile dropdown menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-popover border border-border p-1 z-50" 
                    id="user-dropdown-menu"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-bold text-foreground dark:text-foreground" role="presentation">{user?.name}</p>
                      <p className="text-xs text-foreground/80 dark:text-foreground/80 mt-1" role="presentation">{user?.email}</p>
                    </div>
                    <Link 
                      href="/settings?tab=profile" 
                      className="flex items-center px-4 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setUserDropdownOpen(false)}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <User className="mr-2 h-4 w-4" aria-hidden="true" />
                      Your Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      className="flex items-center px-4 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setUserDropdownOpen(false)}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                      Settings
                    </Link>
                    <Link 
                      href="/notifications" 
                      className="flex items-center px-4 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setUserDropdownOpen(false)}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <Bell className="mr-2 h-4 w-4" aria-hidden="true" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground" aria-label={`${unreadCount} unread notifications`}>
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <div className="border-t border-border my-1" role="separator"></div>
                    <button 
                      className="flex w-full items-center px-4 py-2 text-sm rounded-sm text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={handleLogout}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                asChild
              >
                <Link href="/">
                  Sign In
                </Link>
              </Button>
            )}
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border" id="mobile-menu" role="navigation" aria-label="Mobile navigation">
          <div className="space-y-1 px-4 py-3 border-t">
            {filteredNavigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`flex w-full items-center justify-between px-3 py-2 rounded-md text-sm ${pathname.startsWith(item.href) ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                      aria-expanded={activeDropdown === item.name}
                      aria-controls={`mobile-dropdown-${item.name}`}
                      aria-haspopup="true"
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="ml-6 mt-1 space-y-1" id={`mobile-dropdown-${item.name}`} role="menu" aria-orientation="vertical">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className={`block px-3 py-2 rounded-md text-sm ${pathname === subitem.href ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                            role="menuitem"
                            aria-label={subitem.description || subitem.name}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm ${pathname === item.href ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                    aria-current={pathname === item.href ? "page" : undefined}
                    aria-label={item.description || item.name}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                )}
              </div>
            ))}

            {isAuthenticated && (
              <Link
                href="/notifications"
                className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span className="ml-3">Notifications</span>
                {unreadCount > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground" aria-hidden="true">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
          </div>
          <div className="border-t border-border px-4 py-3">
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatar.png" alt={user?.name || 'User profile'} />
                    <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-bold text-foreground dark:text-foreground">{user?.name}</div>
                  <div className="text-xs text-foreground/80 dark:text-foreground/80">{user?.email}</div>
                </div>
              </div>
            ) : (
              <div className="border-t border-border p-4">
                <Button 
                  variant="default" 
                  className="w-full font-medium"
                  asChild
                >
                  <Link href="/">
                    Sign In
                  </Link>
                </Button>
              </div>
            )}
            <div className="mt-3 space-y-1" role="menu">
              {isAuthenticated && (
                <>
                  <Link
                    href="/settings?tab=profile"
                    className="block px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                    role="menuitem"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  <button
                    className="block w-full text-left px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 