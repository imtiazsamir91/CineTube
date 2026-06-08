import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "@/service/watchlistService";

type WatchlistResponse = { success: boolean; data: any[]; message: string };

export const useWatchlist = () => {
  const queryClient = useQueryClient();

  
  const { data: watchlistData, isLoading, error } = useQuery<WatchlistResponse>({
    queryKey: ["watchlist"],
    queryFn: async (): Promise<WatchlistResponse> => {
      const response = await getWatchlist();
      return response as WatchlistResponse; 
    },
  });

  if (error) {
    console.error("Hooks: Watchlist fetch error:", error);
  }

  
  const addMutation = useMutation({
    mutationFn: (mediaId: string) => addToWatchlist(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
    onError: (err) => console.error("Hooks: Add mutation error:", err)
  });

  
  const removeMutation = useMutation({
    mutationFn: (mediaId: string) => removeFromWatchlist(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
    onError: (err) => console.error("Hooks: Remove mutation error:", err)
  });

 
  return { 
    watchlist: watchlistData?.data || [], 
    isLoading, 
    addMutation, 
    removeMutation 
  };
};