
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ClipboardCheck, 
  BarChart4,
  User,
  AlertTriangle,
  ChevronRight, 
  CheckCircle,
  Clock,
  FileText,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VerificationSteps } from '@/components/marketplace/verification/VerificationSteps';
import { getLevelDescription } from '@/components/marketplace/verification/utils';

interface EvaluationTask {
  id: string;
  bid_id: string;
  tender_title: string;
  supplier_name: string;
  deadline: string;
  status: string;
  evaluation_progress: number;
}

const EvaluatorDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<EvaluationTask[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [evaluationType, setEvaluationType] = useState('technical');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user roles to determine evaluator type
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role');
        
        if (rolesError) throw rolesError;
        
        const roles = rolesData?.map((r: any) => r.role) || [];
        setUserRoles(roles);
        
        // Determine evaluation type from roles
        const evaluatorRole = roles.find((role: string) => role.startsWith('evaluator_'));
        if (evaluatorRole) {
          setEvaluationType(evaluatorRole.replace('evaluator_', ''));
        }
        
        // Fetch evaluations (would be filtered by user ID in real implementation)
        // This is a placeholder - real implementation would have proper joins
        const mockTasks: EvaluationTask[] = [
          {
            id: '1',
            bid_id: 'bid1',
            tender_title: 'IT Infrastructure Upgrade',
            supplier_name: 'TechPro Solutions',
            deadline: '2025-05-20',
            status: 'pending',
            evaluation_progress: 0,
          },
          {
            id: '2',
            bid_id: 'bid2',
            tender_title: 'Office Equipment Supply',
            supplier_name: 'Office Supplies Ltd',
            deadline: '2025-05-15',
            status: 'pending',
            evaluation_progress: 0,
          },
          {
            id: '3',
            bid_id: 'bid3',
            tender_title: 'Consulting Services',
            supplier_name: 'Expert Consultants Inc',
            deadline: '2025-05-10',
            status: 'in_progress',
            evaluation_progress: 60,
          },
          {
            id: '4',
            bid_id: 'bid4',
            tender_title: 'Software Development',
            supplier_name: 'CodeMasters',
            deadline: '2025-04-30',
            status: 'completed',
            evaluation_progress: 100,
          },
          {
            id: '5',
            bid_id: 'bid5',
            tender_title: 'Training Services',
            supplier_name: 'Learning Solutions',
            deadline: '2025-04-25',
            status: 'completed',
            evaluation_progress: 100,
          },
        ];
        
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching evaluator data:', error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading your evaluation tasks",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [toast]);

  const getTaskStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getFormattedEvaluationType = () => {
    return evaluationType.charAt(0).toUpperCase() + evaluationType.slice(1);
  };
  
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'pending') {
      return task.status.toLowerCase() === 'pending';
    } else if (activeTab === 'in_progress') {
      return task.status.toLowerCase() === 'in_progress';
    } else if (activeTab === 'completed') {
      return task.status.toLowerCase() === 'completed';
    }
    return true;
  });
  
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const inProgressCount = tasks.filter(task => task.status === 'in_progress').length;

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Evaluator Dashboard</h1>
        <Badge className="text-base py-1 px-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-full">
          {getFormattedEvaluationType()} Evaluator
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending Evaluations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{pendingCount}</div>
              <ClipboardCheck className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{inProgressCount}</div>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{completedCount}</div>
              <BarChart4 className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Evaluation Tasks</CardTitle>
          <CardDescription>Manage your bid evaluation tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredTasks.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>No evaluations found</AlertTitle>
                  <AlertDescription>
                    You don't have any {activeTab} evaluation tasks at the moment.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4 flex flex-col md:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{task.tender_title}</h3>
                              {getTaskStatusBadge(task.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Supplier: {task.supplier_name}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar size={14} />
                                <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                              </div>
                              <div className="flex-1">
                                {task.status !== 'pending' && (
                                  <div className="flex items-center gap-2">
                                    <Progress value={task.evaluation_progress} className="h-2" />
                                    <span className="text-xs font-medium">{task.evaluation_progress}%</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant={task.status === 'completed' ? 'outline' : 'default'} 
                            size="sm" 
                            asChild
                          >
                            <Link to={`/evaluations/${task.bid_id}`}>
                              {task.status === 'completed' ? 'View Evaluation' : 'Evaluate'}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Process Guide</CardTitle>
            <CardDescription>Follow these steps for each evaluation</CardDescription>
          </CardHeader>
          <CardContent>
            <VerificationSteps 
              steps={[
                "Review tender details and evaluation criteria",
                "Examine bid documents and technical specifications",
                "Score each criterion as per scoring matrix",
                "Provide justification for each score",
                "Submit final evaluation with recommendations"
              ]}
              currentStep={2}
            />
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                As a {getFormattedEvaluationType()} evaluator, your responsibility is to assess the 
                {evaluationType === 'technical' && " technical capabilities and solutions proposed by suppliers."}
                {evaluationType === 'financial' && " financial viability and cost effectiveness of proposals."}
                {evaluationType === 'legal' && " legal compliance and risk factors of bids."}
                {evaluationType === 'procurement' && " procurement process compliance and documentation."}
                {evaluationType === 'accounting' && " financial statements and accounting practices."}
                {evaluationType === 'engineering' && " engineering specifications and technical solutions."}
              </p>
            </div>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link to="/documentation">View Evaluation Guidelines</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest activities in your evaluation tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Training Services evaluation completed</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New evaluation task assigned: Consulting Services</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Software Development evaluation submitted</p>
                  <p className="text-xs text-muted-foreground">5 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 rounded-full p-1">
                  <User className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Profile verification level upgraded</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EvaluatorDashboard;
