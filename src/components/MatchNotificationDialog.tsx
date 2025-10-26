import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMatchNotifications } from "@/hooks/useMatchNotifications";
import { Sparkles } from "lucide-react";

export const MatchNotificationDialog = () => {
  const { newMatch, clearMatch } = useMatchNotifications();

  if (!newMatch) return null;

  return (
    <Dialog open={!!newMatch} onOpenChange={(open) => !open && clearMatch()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center text-2xl">
            <Sparkles className="w-6 h-6 text-success" />
            It's a Match!
            <Sparkles className="w-6 h-6 text-success" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-warm flex items-center justify-center text-5xl shadow-glow animate-bounce">
              🎉
            </div>
            <p className="text-lg font-semibold mb-2">
              You're now connected with {newMatch.matchedUserName}!
            </p>
            <p className="text-sm text-muted-foreground">
              You can now start planning meetups together
            </p>
          </div>

          <Button
            onClick={clearMatch}
            className="w-full gradient-warm shadow-soft hover:shadow-glow transition-all"
          >
            Awesome!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
