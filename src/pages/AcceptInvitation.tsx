import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import BusinessService from '@/services/BusinessService';

const AcceptInvitation: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { user, loading: authLoading } = useAuth();
  const { refresh, switchBusiness } = useBusiness();
  const navigate = useNavigate();
  const [state, setState] = useState<'working' | 'done' | 'error' | 'signin'>('working');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authLoading || !token) return;
    if (!user) {
      setState('signin');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const businessId = await BusinessService.acceptInvitation(token, user.id);
        if (cancelled) return;
        await refresh();
        switchBusiness(businessId);
        setState('done');
      } catch (error: any) {
        if (cancelled) return;
        setMessage(error.message || 'This invitation could not be accepted.');
        setState('error');
      }
    })();

    return () => { cancelled = true; };
  }, [token, user, authLoading, refresh, switchBusiness]);

  return (
    <div className="container mx-auto flex justify-center py-20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Team invitation</CardTitle>
          <CardDescription>Joining a business on ProcureChain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state === 'working' && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking your invitation…
            </p>
          )}

          {state === 'signin' && (
            <>
              <p className="text-sm text-muted-foreground">
                Sign in with the email address the invitation was sent to, then open this link again.
              </p>
              <Button onClick={() => navigate('/auth')}>Sign in</Button>
            </>
          )}

          {state === 'done' && (
            <>
              <p className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" /> You have joined the business.
              </p>
              <Button onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
            </>
          )}

          {state === 'error' && (
            <>
              <p className="flex items-start gap-2 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4" /> {message}
              </p>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;
