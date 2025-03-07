
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const AuthForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <Card className="w-full max-w-md mx-auto glass-card">
      <Tabs defaultValue="signin">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Welcome to ProcureChain</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one.
          </CardDescription>
          <TabsList className="grid grid-cols-2 mt-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent>
          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="Enter your email" className="pl-10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password" 
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="signup-email" type="email" placeholder="Enter your email" className="pl-10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Input 
                  id="signup-password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a password" 
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 8 characters long with 1 uppercase letter and 1 number.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer / Procuring Entity</SelectItem>
                  <SelectItem value="supplier">Supplier / Vendor</SelectItem>
                  <SelectItem value="evaluator">Evaluator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </label>
            </div>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <TabsContent value="signin" className="w-full">
            <Button className="w-full button-hover-effect">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>
          
          <TabsContent value="signup" className="w-full">
            <Button className="w-full button-hover-effect">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>
          
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Secured with blockchain technology
            </div>
          </div>
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
