"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Info } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication
    if (data.email === 'member@example.com' && data.password === 'password') {
      login({
        id: '1',
        name: 'Test Member',
        email: data.email,
        avatarUrl: `https://placehold.co/100x100.png?text=${data.email.substring(0,1).toUpperCase()}`,
        role: 'member'
      });
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      router.push('/');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. (Hint: member@example.com / password)',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleDemoLogin = () => {
    setValue('email', 'member@example.com');
    setValue('password', 'password');
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Demo Login Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-900">Demo Login</h3>
                <p className="text-sm text-blue-800">
                  Test member features with these demo credentials:
                </p>
                <div className="bg-blue-100 rounded p-2 text-sm font-mono text-blue-900">
                  <div><strong>Email:</strong> member@example.com</div>
                  <div><strong>Password:</strong> password</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDemoLogin}
                  className="text-blue-700 border-blue-300 hover:bg-blue-100"
                >
                  Fill Demo Credentials
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="shadow-xl bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-lora text-card-foreground">Welcome Back!</CardTitle>
            <CardDescription className="text-card-foreground/80">
              Log in to access member features and church events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} placeholder="you@example.com" className="bg-input" />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register('password')} placeholder="••••••••" className="bg-input" />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Button variant="link" asChild className="p-0 h-auto text-accent hover:text-accent/80">
                <Link href="/register">Register here</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
