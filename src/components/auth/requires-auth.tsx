'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Loader2 } from 'lucide-react';

interface RequiresAuthProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'user'>;
}

export function RequiresAuth({ children, allowedRoles }: RequiresAuthProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Fix hydration issues
    setChecked(true);
  }, []);

  useEffect(() => {
    if (checked) {
      if (!isAuthenticated) {
        // Save the current path to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', pathname);
        router.push('/');
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // User is authenticated but doesn't have the required role
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, router, allowedRoles, user, checked, pathname]);

  if (!checked || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <h2 className="text-xl font-bold text-foreground dark:text-foreground">Checking authentication...</h2>
        </div>
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <h2 className="text-xl font-bold text-destructive">Access Denied</h2>
          <p className="text-base text-foreground/80 dark:text-foreground/80">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 