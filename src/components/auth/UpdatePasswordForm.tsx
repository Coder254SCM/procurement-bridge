import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const UpdatePasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return {
      isValid: minLength && hasUppercase && hasLowercase && hasNumber,
      issues: [
        !minLength && 'At least 8 characters',
        !hasUppercase && 'At least one uppercase letter',
        !hasLowercase && 'At least one lowercase letter',
        !hasNumber && 'At least one number',
      ].filter(Boolean)
    };
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }
    
    const validation = validatePassword(password);
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Invalid password",
        description: `Password must have: ${validation.issues.join(', ')}`,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await updatePassword(password);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: error.message || "Failed to update password. Please try again.",
        });
      } else {
        setPasswordUpdated(true);
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated",
        });
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (passwordUpdated) {
    return (
      <Card className="w-full max-w-md mx-auto glass-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-semibold">Password Updated</CardTitle>
          <CardDescription>
            Your password has been successfully updated. You will be redirected to your dashboard.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const passwordValidation = validatePassword(password);
  
  return (
    <Card className="w-full max-w-md mx-auto glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Set New Password
        </CardTitle>
        <CardDescription>
          Choose a strong password for your account.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
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
                placeholder="Enter your new password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            {password && (
              <div className="text-xs space-y-1">
                <p className="font-medium">Password requirements:</p>
                <ul className="space-y-1">
                  {passwordValidation.issues.map((issue, index) => (
                    <li key={index} className="text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {issue}
                    </li>
                  ))}
                  {passwordValidation.isValid && (
                    <li className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Password meets all requirements
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-600">Passwords do not match</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full button-hover-effect" 
            disabled={isLoading || !passwordValidation.isValid || password !== confirmPassword}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdatePasswordForm;