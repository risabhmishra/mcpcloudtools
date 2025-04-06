import { create } from 'zustand';

// Define notification types
type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Define notification interface 
export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  isRead: boolean;
  date: Date;
  link?: string;
}

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Execution Completed',
    description: 'Your cloud tool "Data Sync" completed successfully.',
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
    title: 'Execution Failed',
    description: 'Cloud tool "Data Migration" failed with error code E1234.',
    type: 'error',
    isRead: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: '4',
    title: 'Tool Updated',
    description: 'Your tool "PDF Generator" was updated to version 2.3.0.',
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
    title: 'Account Limits',
    description: 'You are approaching your monthly execution limits. Consider upgrading your plan.',
    type: 'warning',
    isRead: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 72) // 3 days ago
  },
  {
    id: '7',
    title: 'New Feature Available',
    description: 'Visual workflow editor is now available for all users.',
    type: 'info',
    isRead: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 120) // 5 days ago
  }
];

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: sampleNotifications,
  unreadCount: sampleNotifications.filter(n => !n.isRead).length,
  
  setNotifications: (notifications) => 
    set({
      notifications,
      unreadCount: notifications.filter(n => !n.isRead).length
    }),
  
  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date(),
      isRead: false
    };
    
    const updatedNotifications = [newNotification, ...get().notifications];
    set({
      notifications: updatedNotifications,
      unreadCount: updatedNotifications.filter(n => !n.isRead).length
    });
  },
  
  markAsRead: (id) => {
    const updatedNotifications = get().notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    
    set({
      notifications: updatedNotifications,
      unreadCount: updatedNotifications.filter(n => !n.isRead).length
    });
  },
  
  markAllAsRead: () => {
    const updatedNotifications = get().notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    
    set({
      notifications: updatedNotifications,
      unreadCount: 0
    });
  },
  
  removeNotification: (id) => {
    const updatedNotifications = get().notifications.filter(
      notification => notification.id !== id
    );
    
    set({
      notifications: updatedNotifications,
      unreadCount: updatedNotifications.filter(n => !n.isRead).length
    });
  }
})); 