import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMatchNotifications } from "@/hooks/useMatchNotifications";
import { IcebreakerScreen } from "@/components/IcebreakerScreen";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { getDurhamVenues } from "@/lib/durham-venues";

export const MatchNotificationDialog = () => {
  const { newMatch, clearMatch } = useMatchNotifications();
  const [showIcebreaker, setShowIcebreaker] = useState(false);
  const [sharedEmojiCode, setSharedEmojiCode] = useState("");
  const [venueName, setVenueName] = useState("");
  const [landmark, setLandmark] = useState("");
  const [meetCode, setMeetCode] = useState("");

  // Generate meeting details when match is created
  useEffect(() => {
    if (newMatch) {
      // Generate emoji codes
      const emojis = ["🐱", "☕", "🌿", "🪩", "🎨", "📚", "🎵", "🏃", "🧘", "🍕"];
      const userEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const matchEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      setSharedEmojiCode(`${userEmoji}${matchEmoji}`);
      
      // Select venue and landmark
      const venues = getDurhamVenues();
      const venue = venues[Math.floor(Math.random() * Math.min(10, venues.length))];
      setVenueName(venue.name);
      
      if (venue.landmarks && venue.landmarks.length > 0) {
        const selectedLandmark = venue.landmarks[Math.floor(Math.random() * venue.landmarks.length)];
        setLandmark(selectedLandmark);
      }
      
      // Generate meet code
      setMeetCode(`MEET${Math.floor(Math.random() * 10000)}`);
    }
  }, [newMatch]);

  const handleContinue = () => {
    setShowIcebreaker(true);
  };

  if (!newMatch) return null;

  return (
    <>
    <Dialog open={!!newMatch && !showIcebreaker} onOpenChange={(open) => !open && clearMatch()}>
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
            onClick={handleContinue}
            className="w-full gradient-warm shadow-soft hover:shadow-glow transition-all"
          >
            Let's Meet!
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <IcebreakerScreen
      open={showIcebreaker}
      onClose={() => {
        setShowIcebreaker(false);
        clearMatch();
      }}
      userName={newMatch.matchedUserName}
      meetCode={meetCode}
      sharedEmojiCode={sharedEmojiCode}
      venueName={venueName}
      landmark={landmark}
    />
  </>
  );
};
