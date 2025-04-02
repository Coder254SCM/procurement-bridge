
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { UserRole, UserRoleRecord } from '@/types/database.types';

interface UserRolesManagerProps {
  userRoles: UserRoleRecord[];
  selectedRole: UserRole | null;
  handleRoleChange: (value: string) => void;
  handleAddRole: () => void;
  handleRemoveRole: (roleId: string) => void;
  loading: boolean;
}

const UserRolesManager = ({
  userRoles,
  selectedRole,
  handleRoleChange,
  handleAddRole,
  handleRemoveRole,
  loading
}: UserRolesManagerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Roles</CardTitle>
        <CardDescription>
          Manage your roles in the procurement system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Current Roles</h3>
          {userRoles.length === 0 ? (
            <p className="text-muted-foreground">You don't have any roles assigned yet.</p>
          ) : (
            <div className="space-y-2">
              {userRoles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
                  <span className="font-medium">{role.role}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveRole(role.id)}
                    disabled={loading}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add New Role</h3>
          <div className="flex gap-4">
            <Select onValueChange={handleRoleChange}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.BUYER}>Buyer</SelectItem>
                <SelectItem value={UserRole.SUPPLIER}>Supplier</SelectItem>
                <SelectItem value={UserRole.EVALUATOR_FINANCE}>Financial Evaluator</SelectItem>
                <SelectItem value={UserRole.EVALUATOR_TECHNICAL}>Technical Evaluator</SelectItem>
                <SelectItem value={UserRole.EVALUATOR_PROCUREMENT}>Procurement Evaluator</SelectItem>
                <SelectItem value={UserRole.EVALUATOR_ENGINEERING}>Engineering Evaluator</SelectItem>
                <SelectItem value={UserRole.EVALUATOR_LEGAL}>Legal Evaluator</SelectItem>
                <SelectItem value={UserRole.EVALUATOR_ACCOUNTING}>Accounting Evaluator</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddRole} disabled={!selectedRole || loading}>
              Add Role
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRolesManager;
