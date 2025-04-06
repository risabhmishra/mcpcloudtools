"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Check, X, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/auth-store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';

// Schema for login form
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Schema for signup form with stronger password validation
const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .refine((password) => /[A-Z]/.test(password), {
      message: 'Password must include at least one uppercase letter',
    })
    .refine((password) => /[0-9]/.test(password), {
      message: 'Password must include at least one number',
    })
    .refine((password) => /[^A-Za-z0-9]/.test(password), {
      message: 'Password must include at least one special character',
    }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export function AuthForms() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  // Check if user is authenticated and redirect
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      sessionStorage.removeItem('redirectAfterLogin'); // Clear storage after redirect
      router.push(redirectPath);
    }
  }, [isAuthenticated, router]);
  
  return (
    <Tabs 
      defaultValue="login" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full max-w-md mx-auto"
    >
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <LoginForm setActiveTab={setActiveTab} />
      </TabsContent>
      
      <TabsContent value="signup">
        <SignupForm setActiveTab={setActiveTab} />
      </TabsContent>
    </Tabs>
  );
}

function LoginForm({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    await login(values.email, values.password);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground dark:text-foreground">Login</CardTitle>
        <CardDescription className="text-foreground/80 dark:text-foreground/80">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        clearError();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        clearError();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-foreground/80 dark:text-foreground/80 text-center">
          <span>Don't have an account? </span>
          <Button 
            variant="link" 
            className="p-0 h-auto font-medium" 
            onClick={() => setActiveTab('signup')}
          >
            Sign up
          </Button>
        </div>
        <div className="text-sm text-foreground/80 dark:text-foreground/80 text-center">
          <span className="font-medium">Demo credentials:</span>
          <div className="mt-1">
            <code className="px-1 py-0.5 bg-muted text-foreground rounded text-xs">admin@example.com / admin123</code>
          </div>
          <div className="mt-1">
            <code className="px-1 py-0.5 bg-muted text-foreground rounded text-xs">user@example.com / user123</code>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

function SignupForm({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: "onChange", // Enable real-time validation feedback
  });
  
  // Update password strength when password changes
  useEffect(() => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);
  
  const onSubmit = async (values: SignupFormValues) => {
    await registerUser(values.name, values.email, values.password);
  };
  
  // Get colored class based on password strength
  const getPasswordStrengthClass = () => {
    if (passwordStrength === 0) return "bg-destructive";
    if (passwordStrength === 1) return "bg-destructive";
    if (passwordStrength === 2) return "bg-orange-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  // Get text label based on password strength
  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return "Very Weak";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground dark:text-foreground">Create an account</CardTitle>
        <CardDescription className="text-foreground/80 dark:text-foreground/80">
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Doe" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        clearError();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        clearError();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setPassword(e.target.value);
                          clearError();
                        }}
                      />
                    </div>
                  </FormControl>
                  
                  {/* Password strength indicator */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex mb-1 items-center justify-between">
                        <span className="text-xs">Password strength: <span className="font-semibold">{getPasswordStrengthLabel()}</span></span>
                      </div>
                      <div className="h-1.5 w-full bg-background border">
                        <div 
                          className={`h-full ${getPasswordStrengthClass()}`} 
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        />
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center text-xs">
                          {password.length >= 8 ? 
                            <Check className="h-3.5 w-3.5 text-green-500 mr-1.5" /> : 
                            <X className="h-3.5 w-3.5 text-red-500 mr-1.5" />}
                          <span>At least 8 characters</span>
                        </div>
                        <div className="flex items-center text-xs">
                          {/[A-Z]/.test(password) ? 
                            <Check className="h-3.5 w-3.5 text-green-500 mr-1.5" /> : 
                            <X className="h-3.5 w-3.5 text-red-500 mr-1.5" />}
                          <span>At least one uppercase letter</span>
                        </div>
                        <div className="flex items-center text-xs">
                          {/[0-9]/.test(password) ? 
                            <Check className="h-3.5 w-3.5 text-green-500 mr-1.5" /> : 
                            <X className="h-3.5 w-3.5 text-red-500 mr-1.5" />}
                          <span>At least one number</span>
                        </div>
                        <div className="flex items-center text-xs">
                          {/[^A-Za-z0-9]/.test(password) ? 
                            <Check className="h-3.5 w-3.5 text-green-500 mr-1.5" /> : 
                            <X className="h-3.5 w-3.5 text-red-500 mr-1.5" />}
                          <span>At least one special character</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        clearError();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-foreground/80 dark:text-foreground/80 text-center w-full">
          <span>Already have an account? </span>
          <Button 
            variant="link" 
            className="p-0 h-auto font-medium" 
            onClick={() => setActiveTab('login')}
          >
            Login
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 