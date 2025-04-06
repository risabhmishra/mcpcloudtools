'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  Check, 
  CheckCircle2, 
  Info, 
  Search, 
  AlertTriangle, 
  XCircle,
  Trash2,
  Users,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useNotificationStore, Notification } from '@/stores/notification-store'
import { useRouter, useSearchParams } from 'next/navigation'
import { RequiresAuth } from '@/components/auth/requires-auth'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useTeamStore } from '@/stores/team-store'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Define notification types
type NotificationType = 'info' | 'success' | 'warning' | 'error'

// Define notification interface 
interface Notification {
  id: string
  title: string
  description: string
  type: NotificationType
  isRead: boolean
  date: Date
  link?: string
}

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Tool Invocation Successful',
    description: 'Your LLM tool "Weather API" was successfully invoked by ChatGPT-4.',
    type: 'success',
    isRead: false,
    date: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  },
  {
    id: '2',
    title: 'User Joined',
    description: 'Jane Smith (jane.smith@example.com) accepted your invitation.',
    type: 'info',
    isRead: false,
    date: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: '3',
    title: 'Tool Invocation Failed',
    description: 'LLM tool "PDF Parser" failed with error code E1234 when invoked by Claude-3.',
    type: 'error',
    isRead: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: '4',
    title: 'Tool Updated',
    description: 'Your tool "Text Summarizer" was updated to version 2.3.0.',
    type: 'info',
    isRead: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    id: '5',
    title: 'Maintenance Scheduled',
    description: 'System maintenance scheduled on July 15, 2023, from 2:00 AM to 4:00 AM UTC.',
    type: 'warning',
    isRead: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
  },
  {
    id: '6',
    title: 'API Limits',
    description: 'You are approaching your monthly LLM tool invocation limits. Consider upgrading your plan.',
    type: 'warning',
    isRead: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 72) // 3 days ago
  },
  {
    id: '7',
    title: 'New Feature Available',
    description: 'Advanced LLM tool analytics dashboard is now available for all users.',
    type: 'info',
    isRead: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 120) // 5 days ago
  }
];

// Format relative time from date
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
};

// Get icon for notification type
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'info':
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification 
  } = useNotificationStore();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabParam === 'unread' ? 'unread' : 'all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { invitations, acceptInvitation, declineInvitation, fetchInvitations, isLoading: invitationsLoading } = useTeamStore();
  
  // Update tab from URL if it changes
  useEffect(() => {
    if (tabParam === 'unread') {
      setActiveTab('unread');
    } else if (tabParam === 'all') {
      setActiveTab('all');
    }
  }, [tabParam]);
  
  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);
  
  const isLoading = invitationsLoading;
  
  // Filter pending invitations
  const pendingInvitations = invitations.filter(invitation => invitation.status === 'pending');

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleRemove = (id: string) => {
    removeNotification(id);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/notifications?tab=${value}`);
  };
  
  const filteredNotifications = notifications.filter(notification => {
    // Filter by tab
    if (activeTab === 'unread' && notification.isRead) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const renderNotificationList = () => {
    if (filteredNotifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium">No notifications</h3>
          {activeTab === 'unread' ? (
            <p className="text-gray-500 mt-2">You've read all your notifications.</p>
          ) : searchQuery ? (
            <p className="text-gray-500 mt-2">No notifications match your search.</p>
          ) : (
            <p className="text-gray-500 mt-2">You don't have any notifications yet.</p>
          )}
        </div>
      );
    }
    
    return filteredNotifications.map(notification => (
      <Card key={notification.id} className={cn(
        "mb-3 transition-all",
        !notification.isRead ? "border-l-4 border-l-blue-500 dark:border-l-blue-400" : ""
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {getNotificationIcon(notification.type)}
              <CardTitle className="text-base">{notification.title}</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Mark as read</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemove(notification.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          <CardDescription className="text-xs">
            {formatRelativeTime(notification.date)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{notification.description}</p>
        </CardContent>
        {notification.link && (
          <CardFooter className="pt-0">
            <Button variant="link" className="h-auto p-0 text-sm" asChild>
              <a href={notification.link}>View details</a>
            </Button>
          </CardFooter>
        )}
      </Card>
    ));
  };
  
  return (
    <RequiresAuth>
      <div className="container py-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your latest activities
            </p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
            type="search"
            prefixIcon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
        
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">
                All
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
              <TabsTrigger value="invitations">
                Team Invitations
                {pendingInvitations.length > 0 && (
                  <Badge className="ml-2 bg-primary">{pendingInvitations.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          
          {isLoading ? (
            <NotificationsSkeleton />
          ) : (
            <>
              <TabsContent value="all" className="mt-0">
                {notifications.length === 0 && pendingInvitations.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-4">
                    {/* Team Invitations */}
                    {pendingInvitations.map((invitation) => (
                      <TeamInvitationCard 
                        key={`invitation-${invitation.id}`}
                        invitation={invitation}
                        onAccept={() => acceptInvitation(invitation.id)}
                        onDecline={() => declineInvitation(invitation.id)}
                      />
                    ))}
                    
                    {/* Regular Notifications */}
                    {notifications.map((notification) => (
                      <NotificationCard 
                        key={`notification-${notification.id}`}
                        notification={notification}
                        onMarkAsRead={() => handleMarkAsRead(notification.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="invitations" className="mt-0">
                {pendingInvitations.length === 0 ? (
                  <EmptyInvitationsState />
                ) : (
                  <div className="space-y-4">
                    {pendingInvitations.map((invitation) => (
                      <TeamInvitationCard 
                        key={`invitation-tab-${invitation.id}`}
                        invitation={invitation}
                        onAccept={() => acceptInvitation(invitation.id)}
                        onDecline={() => declineInvitation(invitation.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="unread" className="mt-0">
                {notifications.filter(n => !n.isRead).length === 0 ? (
                  <EmptyUnreadState />
                ) : (
                  <div className="space-y-4">
                    {notifications.filter(n => !n.isRead).map((notification) => (
                      <NotificationCard 
                        key={`unread-${notification.id}`}
                        notification={notification}
                        onMarkAsRead={() => handleMarkAsRead(notification.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </RequiresAuth>
  );
}

function NotificationCard({ notification, onMarkAsRead }) {
  return (
    <Card className={notification.isRead ? 'opacity-70' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={notification.imageUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bell className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">{notification.title}</div>
            <div className="text-sm text-muted-foreground mt-1">{notification.description}</div>
            <div className="text-xs text-muted-foreground mt-2">{formatRelativeTime(notification.date)}</div>
          </div>
          {!notification.isRead && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onMarkAsRead}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Mark as read</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TeamInvitationCard({ invitation, onAccept, onDecline }) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Users className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium flex items-center">
              Team Invitation
              <Badge className="ml-2 bg-blue-500 text-white">New</Badge>
            </div>
            <div className="text-sm mt-1">
              You've been invited to join <span className="font-medium">{invitation.teamName}</span> as a <span className="font-medium">{invitation.role}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Invited by {invitation.invitedBy} on {formatDate(invitation.invitedAt)}
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={onAccept}>
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button size="sm" variant="outline" onClick={onDecline}>
                <XCircle className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">No Notifications</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          You're all caught up! There are no notifications at the moment. We'll notify you when there's activity.
        </p>
      </div>
    </Card>
  );
}

function EmptyInvitationsState() {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <Mail className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">No Team Invitations</h2>
        <p className="text-muted-foreground mb-2 max-w-md">
          You don't have any pending team invitations at the moment.
        </p>
      </div>
    </Card>
  );
}

function EmptyUnreadState() {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <Check className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">No Unread Notifications</h2>
        <p className="text-muted-foreground mb-2 max-w-md">
          You've read all your notifications. Check back later for new updates.
        </p>
      </div>
    </Card>
  );
}

function NotificationsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-64 mb-2" />
                <Skeleton className="h-3 w-96 mb-2" />
                <Skeleton className="h-3 w-24 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 