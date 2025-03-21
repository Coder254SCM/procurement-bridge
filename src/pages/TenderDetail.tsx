
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, AlertTriangle, Share2, Download, FileText, Users, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { TenderProps } from '@/components/tenders/TenderCard';
import TenderTimeline from '@/components/tenders/TenderTimeline';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import BlockchainVerificationDetails from '@/components/verification/BlockchainVerificationDetails';

const TenderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [tender, setTender] = useState<TenderProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  
  useEffect(() => {
    const fetchTenderDetails = async () => {
      try {
        setLoading(true);
        
        // In a real app, fetch from Supabase based on ID
        // For now using static data
        const fakeTenders: TenderProps[] = [
          {
            id: "T1001",
            title: "Supply and Installation of IT Equipment for County Offices",
            organization: "Ministry of ICT",
            location: "Nairobi County",
            category: "IT & Telecommunications",
            description: "Provision of desktop computers, laptops, printers and networking equipment for county government offices across Nairobi county. This includes 200 desktop computers, 50 laptops, 75 printers, and networking equipment for secure local area networks across all county offices.",
            deadline: "Jul 15, 2023",
            daysLeft: 12,
            submissions: 8,
            value: "KES 12,500,000",
            status: 'open'
          },
          {
            id: "T1002",
            title: "Construction of Health Center in Kiambu County",
            organization: "Ministry of Health",
            location: "Kiambu County",
            category: "Construction",
            description: "Construction of a new health center including outpatient facilities, maternity ward, laboratory and pharmacy services.",
            deadline: "Jul 22, 2023",
            daysLeft: 19,
            submissions: 5,
            value: "KES 35,800,000",
            status: 'open'
          }
        ];
        
        const foundTender = fakeTenders.find(t => t.id === id);
        if (foundTender) {
          setTender(foundTender);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tender details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load tender details",
        });
        setLoading(false);
      }
    };
    
    if (id) {
      fetchTenderDetails();
    }
  }, [id, toast]);
  
  const generateInviteLink = () => {
    // Generate shareable link
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/tender/${id}?ref=invitation`;
    setInviteLink(inviteUrl);
    setInviteDialog(true);
  };
  
  const shareOnPlatform = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(tender?.title || 'Tender Opportunity');
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      default:
        shareUrl = '';
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
    
    toast({
      title: "Link shared",
      description: `Sharing tender on ${platform}`,
    });
  };
  
  if (loading) {
    return (
      <div className="container py-6 px-4 md:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-1/3 bg-secondary/40 rounded"></div>
          <div className="h-8 w-3/4 bg-secondary/60 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-60 bg-secondary/40 rounded mb-6"></div>
              <div className="h-8 w-1/2 bg-secondary/60 rounded mb-4"></div>
              <div className="h-4 w-full bg-secondary/40 rounded mb-2"></div>
              <div className="h-4 w-full bg-secondary/40 rounded mb-2"></div>
              <div className="h-4 w-full bg-secondary/40 rounded mb-2"></div>
            </div>
            <div>
              <div className="h-40 bg-secondary/40 rounded mb-4"></div>
              <div className="h-40 bg-secondary/40 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!tender) {
    return (
      <div className="container py-6 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold mb-6">Tender Not Found</h1>
        <p className="text-muted-foreground mb-6">The tender you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/marketplace">Back to Marketplace</Link>
        </Button>
      </div>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
      case 'evaluation':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400';
      case 'awarded':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };
  
  return (
    <div className="container py-6 px-4 md:px-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/marketplace">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{tender.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline" className="text-sm font-normal">{tender.category}</Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{tender.organization}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{tender.location}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => shareOnPlatform('twitter')}>
                Share on Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareOnPlatform('linkedin')}>
                Share on LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareOnPlatform('whatsapp')}>
                Share on WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={generateInviteLink}>
                Generate Invite Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button>Apply for Tender</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tender Details</CardTitle>
              <CardDescription>Reference: {tender.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className={`${getStatusColor(tender.status)} text-xs font-medium px-2.5 py-0.5 rounded`}>
                  {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                </Badge>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Published: June 1, 2023</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{tender.description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Budget</h3>
                  <p className="text-2xl font-bold">{tender.value}</p>
                  <p className="text-sm text-muted-foreground">Maximum allocated budget</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Deadline</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{tender.deadline}</span>
                  </div>
                  {tender.daysLeft > 0 ? (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {tender.daysLeft} days remaining
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Submission closed
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Documents</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Tender Requirements Document</span>
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Technical Specifications</span>
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Financial Proposal Template</span>
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Verification</CardTitle>
              <CardDescription>
                This tender is secured and verified using Hyperledger Fabric blockchain technology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlockchainVerificationDetails hash="0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069" />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tender Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>
                      {tender.status === 'open' ? '25%' : 
                       tender.status === 'evaluation' ? '50%' : 
                       tender.status === 'awarded' ? '75%' : '100%'}
                    </span>
                  </div>
                  <Progress 
                    value={
                      tender.status === 'open' ? 25 : 
                      tender.status === 'evaluation' ? 50 : 
                      tender.status === 'awarded' ? 75 : 100
                    } 
                    className="h-2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{tender.submissions}</p>
                    <p className="text-xs text-muted-foreground">Submissions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{tender.daysLeft > 0 ? tender.daysLeft : 0}</p>
                    <p className="text-xs text-muted-foreground">Days Left</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Issued By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${tender.organization}`} />
                  <AvatarFallback>{tender.organization.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{tender.organization}</p>
                  <p className="text-sm text-muted-foreground">{tender.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified Organization</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Invite Suppliers</CardTitle>
              <CardDescription>
                Share this opportunity with qualified suppliers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={generateInviteLink}>
                <Users className="mr-2 h-4 w-4" />
                Invite Suppliers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="timeline" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="timeline">Procurement Timeline</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="submission">Submission Guidelines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Procurement Process Timeline</CardTitle>
              <CardDescription>
                Track the progress of this tender from publication to contract award
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TenderTimeline />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requirements" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Technical & Financial Requirements</CardTitle>
              <CardDescription>
                Key eligibility criteria and specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Technical Requirements</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Minimum 5 years experience in IT equipment supply and installation</li>
                  <li>Certified technicians for installation and configuration</li>
                  <li>Ability to provide warranty and after-sales support for at least 2 years</li>
                  <li>Previous experience working with government institutions</li>
                  <li>ISO 9001:2015 certification</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Financial Requirements</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Average annual turnover of at least KES 25,000,000 in the last 3 years</li>
                  <li>Valid tax compliance certificate</li>
                  <li>Audited financial statements for the last 3 years</li>
                  <li>Proof of financial capacity to execute the contract</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Required Documents</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Company registration certificate</li>
                  <li>Tax compliance certificate</li>
                  <li>Manufacturer authorization letters for all equipment</li>
                  <li>Company profile including past similar projects</li>
                  <li>CVs of key technical personnel</li>
                  <li>Detailed implementation plan and methodology</li>
                </ul>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-900/20 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-500">Important Note</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400">Submissions missing any of the required documents will be considered non-responsive and will be automatically disqualified.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submission" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>How to Submit Your Bid</CardTitle>
              <CardDescription>
                Follow these guidelines to ensure your bid is properly submitted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Submission Process</h3>
                <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                  <li>Register an account on the procurement portal if you don't already have one</li>
                  <li>Click the "Apply for Tender" button at the top of this page</li>
                  <li>Complete all required forms and upload all requested documents</li>
                  <li>Submit your technical and financial proposals separately as indicated</li>
                  <li>Ensure all documents are properly signed and stamped</li>
                  <li>Submit your bid before the deadline: {tender.deadline}, 11:59 PM EAT</li>
                </ol>
              </div>
              
              <Separator />
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-500">Blockchain Verification</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      All submissions are cryptographically timestamped using Hyperledger Fabric to ensure transparency and prevent tampering. Your submission will receive a unique verification hash that serves as proof of submission.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={inviteDialog} onOpenChange={setInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Suppliers</DialogTitle>
            <DialogDescription>
              Share this link with qualified suppliers to invite them to bid on this tender.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-2 bg-secondary rounded-md">
              <code className="text-sm break-all">{inviteLink}</code>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button onClick={() => shareOnPlatform('twitter')} variant="outline">
                Twitter
              </Button>
              <Button onClick={() => shareOnPlatform('linkedin')} variant="outline">
                LinkedIn
              </Button>
              <Button onClick={() => shareOnPlatform('whatsapp')} variant="outline">
                WhatsApp
              </Button>
            </div>
            
            <Button 
              className="w-full" 
              onClick={() => {
                navigator.clipboard.writeText(inviteLink);
                toast({
                  title: "Link copied",
                  description: "The invite link has been copied to your clipboard.",
                });
              }}
            >
              Copy to Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenderDetail;
