
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

type SecurityLevel = 'info' | 'warning' | 'critical';

interface SecurityInfoCardProps {
  title: string;
  description: string;
  level: SecurityLevel;
  children?: React.ReactNode;
}

const SecurityInfoCard = ({ title, description, level, children }: SecurityInfoCardProps) => {
  const getLevelIcon = (securityLevel: SecurityLevel) => {
    switch (securityLevel) {
      case 'info':
        return <Shield className="h-6 w-6 text-primary" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case 'critical':
        return <Lock className="h-6 w-6 text-destructive" />;
      default:
        return <Shield className="h-6 w-6 text-primary" />;
    }
  };

  const getLevelClass = (securityLevel: SecurityLevel) => {
    switch (securityLevel) {
      case 'info':
        return 'bg-primary/10';
      case 'warning':
        return 'bg-amber-500/10';
      case 'critical':
        return 'bg-destructive/10';
      default:
        return 'bg-primary/10';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <div className={`p-2 mr-3 rounded-full ${getLevelClass(level)}`}>
            {getLevelIcon(level)}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default SecurityInfoCard;
