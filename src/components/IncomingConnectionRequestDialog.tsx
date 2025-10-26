import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useConnectionRequest } from "@/hooks/useConnectionRequest";
import { useIncomingConnectionRequests } from "@/hooks/useIncomingConnectionRequests";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const IncomingConnectionRequestDialog = () => {
  const { user } = useAuth();
  const { currentRequest, removeRequest } = useIncomingConnectionRequests();
  const { acceptConnectionRequest, rejectConnectionRequest, isLoading } = useConnectionRequest();
  const [autoAccept, setAutoAccept] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);

  // Check user's auto-accept setting
  useEffect(() => {
    if (!user?.id) return;

    const fetchAutoAcceptSetting = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('auto_accept_connections')
        .eq('id', user.id)
        .single();

      setAutoAccept(data?.auto_accept_connections === true);
    };

    fetchAutoAcceptSetting();
  }, [user?.id]);

  // Handle incoming requests
  useEffect(() => {
    if (!currentRequest || autoAccept === null) return;

    if (autoAccept) {
      // Auto-accept the request
      handleAutoAccept();
    } else {
      // Show dialog for manual acceptance
      setOpen(true);
    }
  }, [currentRequest, autoAccept]);

  const handleAutoAccept = async () => {
    if (!currentRequest) return;

    console.log('Auto-accepting connection request:', currentRequest);
    const result = await acceptConnectionRequest(currentRequest.id, currentRequest.sender_id);
    
    if (result.success) {
      removeRequest(currentRequest.id);
    }
  };

  const handleAccept = async () => {
    if (!currentRequest) return;

    const result = await acceptConnectionRequest(currentRequest.id, currentRequest.sender_id);
    
    if (result.success) {
      setOpen(false);
      removeRequest(currentRequest.id);
    }
  };

  const handleReject = async () => {
    if (!currentRequest) return;

    const result = await rejectConnectionRequest(currentRequest.id);
    
    if (result.success) {
      setOpen(false);
      removeRequest(currentRequest.id);
    }
  };

  if (autoAccept || !currentRequest) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connection Request</DialogTitle>
          <DialogDescription>
            {currentRequest.sender_name} wants to connect with you
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-warm flex items-center justify-center text-3xl shadow-soft">
              👋
            </div>
            <p className="text-sm text-muted-foreground">
              Accept this connection request to start connecting!
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleReject}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              Reject
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isLoading}
              className="flex-1 gradient-warm shadow-soft"
            >
              Accept
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
