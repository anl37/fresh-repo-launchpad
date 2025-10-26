import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface MatchNotification {
  matchId: string;
  matchedUserId: string;
  matchedUserName: string;
  timestamp: string;
}

export const useMatchNotifications = () => {
  const { user } = useAuth();
  const [newMatch, setNewMatch] = useState<MatchNotification | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    // Listen for new matches in real-time
    const channel = supabase
      .channel('match-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches'
        },
        async (payload) => {
          const match = payload.new;
          
          // Check if this match involves the current user
          if (match.uid_a === user.id || match.uid_b === user.id) {
            console.log('New match notification:', match);
            
            // Determine the other user's ID
            const otherUserId = match.uid_a === user.id ? match.uid_b : match.uid_a;
            
            // Fetch the other user's profile
            const { data: otherUserProfile } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', otherUserId)
              .single();

            setNewMatch({
              matchId: match.id,
              matchedUserId: otherUserId,
              matchedUserName: otherUserProfile?.name || 'Someone',
              timestamp: match.created_at
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const clearMatch = () => {
    setNewMatch(null);
  };

  return {
    newMatch,
    clearMatch
  };
};
