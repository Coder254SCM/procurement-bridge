
import React, { useState } from 'react';
import { Share2, Copy, Twitter, Linkedin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ShareTenderInviteProps {
  tenderId: string;
  tenderTitle: string;
}

const ShareTenderInvite = ({ tenderId, tenderTitle }: ShareTenderInviteProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
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
  
  const shareOnPlatform = (platform: string) => {
    const url = encodeURIComponent(getInviteLink());
    const title = encodeURIComponent(`Join the bidding for: ${tenderTitle}`);
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
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input
              readOnly
              value={getInviteLink()}
              className="w-full"
            />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center mt-4">
          <p className="text-sm text-muted-foreground mb-3">Share via</p>
          <div className="flex space-x-4">
            <Button variant="outline" size="icon" onClick={() => shareOnPlatform('twitter')}>
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => shareOnPlatform('linkedin')}>
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => shareOnPlatform('whatsapp')}>
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Share on WhatsApp</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTenderInvite;
