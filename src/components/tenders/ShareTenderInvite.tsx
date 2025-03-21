
import React, { useState } from 'react';
import { Share2, Copy, Twitter, Linkedin, MessageSquare, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface ShareTenderInviteProps {
  tenderId: string;
  tenderTitle: string;
  buyerName?: string;
}

const ShareTenderInvite = ({ tenderId, tenderTitle, buyerName = 'Our company' }: ShareTenderInviteProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState(`${buyerName} invites you to participate in our tender: "${tenderTitle}". Click the link below to view details and submit your bid.`);
  const [emailRecipients, setEmailRecipients] = useState('');
  
  const getInviteLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/tender/${tenderId}?source=invitation`;
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(getInviteLink());
    toast({
      title: "Link copied",
      description: "Invitation link copied to clipboard",
    });
  };
  
  const handleCopyWithMessage = () => {
    navigator.clipboard.writeText(`${customMessage}\n\n${getInviteLink()}`);
    toast({
      title: "Message and link copied",
      description: "Custom invitation message with link copied to clipboard",
    });
  };
  
  const shareOnPlatform = (platform: string) => {
    const url = encodeURIComponent(getInviteLink());
    const title = encodeURIComponent(customMessage);
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${title}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      case 'email':
        const subject = encodeURIComponent(`Invitation to Tender: ${tenderTitle}`);
        const validEmails = emailRecipients.split(',').map(email => email.trim()).filter(email => email);
        if (validEmails.length === 0) {
          toast({
            variant: "destructive",
            title: "No recipients",
            description: "Please add at least one email address",
          });
          return;
        }
        const mailtoRecipients = validEmails.join(',');
        shareUrl = `mailto:${mailtoRecipients}?subject=${subject}&body=${title}%20${url}`;
        break;
      default:
        shareUrl = '';
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
    
    toast({
      title: "Invitation shared",
      description: `Tender invitation shared on ${platform}`,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Invite Suppliers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Suppliers</DialogTitle>
          <DialogDescription>
            Share this link with qualified suppliers to invite them to bid on this tender
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="message">Message</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  readOnly
                  value={getInviteLink()}
                  className="w-full"
                />
              </div>
              <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
                <span className="sr-only">Copy</span>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this link directly with suppliers via your preferred channel.
            </p>
          </TabsContent>
          
          <TabsContent value="message" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customized Message</label>
              <Textarea 
                value={customMessage} 
                onChange={(e) => setCustomMessage(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Customize this message to send to suppliers along with the invitation link.
              </p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-muted-foreground">Link will be included automatically</span>
              <Button onClick={handleCopyWithMessage} size="sm">
                Copy Message with Link
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Recipients</label>
              <Input
                placeholder="supplier1@example.com, supplier2@example.com"
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter email addresses separated by commas.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Message</label>
              <Textarea 
                value={customMessage} 
                onChange={(e) => setCustomMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button 
              onClick={() => shareOnPlatform('email')} 
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email Invitation
            </Button>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            <p className="text-sm mb-3">Share via social media platforms</p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="w-full" onClick={() => shareOnPlatform('twitter')}>
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" className="w-full" onClick={() => shareOnPlatform('linkedin')}>
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              <Button variant="outline" className="w-full" onClick={() => shareOnPlatform('whatsapp')}>
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Sharing will use your customized message along with the invitation link.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTenderInvite;
