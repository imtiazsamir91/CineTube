"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Film, Bookmark, X } from "lucide-react"; 
import { useWatchlist } from "@/hooks/useWatchlist"; 
import { toast } from "sonner";
import { createCheckout, verifySubscriptionOtp } from "@/service/subscriptionService";
import { useTransition } from "react";

export default function AllMovies({ mediaList }: { mediaList?: any[] }) {
  const list = Array.isArray(mediaList) ? mediaList : [];
  const { watchlist, addMutation, removeMutation } = useWatchlist();
  const router = useRouter();


  const [showSubModal, setShowSubModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"checkout" | "otp">("checkout");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);


  const [isUserPremium, setIsUserPremium] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isPremium") === "true"; 
    }
    return false;
  });

 
  const isMovieInWatchlist = (id: string) => {
    if (!Array.isArray(watchlist)) return false;
    return watchlist.some((item: any) => item.mediaId === id || item.id === id);
  };

  const handleToggleWatchlist = (movie: any) => {
    const inList = isMovieInWatchlist(movie.id);
    if (inList) {
      removeMutation.mutate(movie.id, {
        onSuccess: () => toast.success("Removed from Watchlist!"),
        onError: () => toast.error("Failed to remove item.")
      });
    } else {
      addMutation.mutate(movie.id, {
        onSuccess: () => toast.success("Added to Watchlist!"),
        onError: () => toast.error("Failed to add item.")
      });
    }
  };

 
  const handleMovieClick = (e: React.MouseEvent, movie: any) => {
    if (movie.pricingType === "PREMIUM" && !isUserPremium) {
      e.preventDefault(); 
      setSelectedMovieId(movie.id);
      setStep("checkout");
      setMessage("");
      setShowSubModal(true); 
    }
  };


  const handleCheckout = () => {
    startTransition(async () => {
      try {
        const res = await createCheckout({ planType: "MONTHLY", amount: 99 });
        if (res.success) {
          setStep("otp");
          setMessage("Payment initiated! Please check your email for the OTP.");
        }
      } catch (err: any) {
        setMessage(err.message || "Checkout failed");
      }
    });
  };

  
  const handleVerify = () => {
    startTransition(async () => {
      try {
        const res = await verifySubscriptionOtp(otp);
        if (res.success) {
          toast.success("Subscription activated successfully!");
          setIsUserPremium(true);
          if (typeof window !== "undefined") {
            localStorage.setItem("isPremium", "true");
          }
          setShowSubModal(false);
          
          if (selectedMovieId) {
            router.push(`/watch/${selectedMovieId}`);
          }
        }
      } catch (err: any) {
        setMessage(err.message || "Verification failed");
      }
    });
  };

  return (
    <div className="w-full px-6 md:px-12 py-10 relative">
      <h2 className="text-xl font-bold text-white mb-6">All Movies 🎬</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {list.map((movie) => {
          const inList = isMovieInWatchlist(movie.id);
          const isPremium = movie.pricingType === "PREMIUM";
          
          return (
            <div key={movie.id} className="group relative block">
             
              <button
                onClick={() => handleToggleWatchlist(movie)}
                disabled={addMutation?.isPending || removeMutation?.isPending}
                className="absolute top-2 right-2 z-10 bg-black/50 p-2 rounded-full hover:bg-red-600 transition disabled:opacity-50"
              >
                <Bookmark className={`w-5 h-5 ${inList ? "fill-white text-white" : "text-white"}`} />
              </button>

             
              <Link 
                href={`/watch/${movie.id}`} 
                onClick={(e) => handleMovieClick(e, movie)}
                className="block transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl">
                 
                  {isPremium && (
                    <span className="absolute top-2 left-2 z-10 bg-amber-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded shadow">
                      PREMIUM ✨
                    </span>
                  )}
                  
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center">
                     <div className="bg-[#B9090B] p-3 rounded-full">
                       <Play className="fill-white text-white w-5 h-5" />
                     </div>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-[14px] text-white font-semibold truncate flex items-center gap-1.5">
                    <Film className="w-3 h-3 text-[#B9090B]" /> {movie.title}
                  </h3>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* 🔒 সাবস্ক্রিপশন মডাল (Popup Flow) */}
      {showSubModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-md w-full relative text-white shadow-2xl">
            
            <button 
              onClick={() => setShowSubModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <span className="text-3xl">🔒</span>
              <h3 className="text-xl font-bold mt-2">Premium Content Gate</h3>
              <p className="text-xs text-zinc-400 mt-1">This media requires an active subscription package.</p>
            </div>

            {message && (
              <div className="mb-4 p-3 rounded-xl bg-indigo-950/50 border border-indigo-800 text-xs text-indigo-300">
                {message}
              </div>
            )}

            {step === "checkout" ? (
              <div className="space-y-4">
                <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 text-center">
                  <p className="text-xs uppercase text-amber-500 font-bold tracking-wider">Premium Monthly Plan</p>
                  <p className="text-2xl font-black mt-1">$99 <span className="text-xs text-zinc-400 font-normal">/ month</span></p>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full bg-[#B9090B] hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
                >
                  {isPending ? "Processing..." : "Subscribe & Pay $99"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl text-center text-lg font-bold tracking-widest outline-none focus:border-red-600 transition"
                />
                <button
                  onClick={handleVerify}
                  disabled={isPending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
                >
                  {isPending ? "Verifying..." : "Verify & Activate"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}