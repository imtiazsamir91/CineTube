"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("landing-email") as string;
    
    if (email) {
      router.push(`/register?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <div 
      className="relative flex min-h-screen w-full flex-col bg-black bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1920&auto=format&fit=crop')",
      }}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/40 to-black/80" />

      <header className="relative z-10 flex w-full items-center justify-between px-6 py-6 md:px-16">
        <div className="text-3xl font-extrabold tracking-tighter text-[#B9090B] md:text-4xl">
          CINETUBE
        </div>
        <Button 
          onClick={() => router.push("/login")}
          className="h-9 bg-[#B9090B] px-4 text-sm font-semibold text-white hover:bg-[#990708] active:bg-[#780506]"
        >
          Sign In
        </Button>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center text-white">
        <div className="max-w-4xl space-y-4 md:space-y-6">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Unlimited movies, TV shows, and more
          </h1>
          <p className="text-xl font-bold md:text-3xl text-zinc-100">
            Starts at USD 2.99. Cancel anytime.
          </p>
          <p className="text-base font-medium md:text-xl text-zinc-300">
            Ready to watch? Enter your email to create or restart your membership.
          </p>

          <form 
            onSubmit={handleGetStarted}
            className="mx-auto flex flex-col items-center justify-center gap-3 pt-4 sm:max-w-3xl sm:flex-row sm:gap-2"
          >
            <div className="w-full sm:flex-1">
              <Input 
                type="email"
                name="landing-email"
                placeholder="Email address"
                required
                className="h-16 w-full border border-zinc-700 bg-black/70 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400 text-lg"
              />
            </div>
            <Button 
              type="submit"
              className="group h-16 w-full bg-[#B9090B] text-xl font-black hover:bg-[#990708] active:bg-[#780506] sm:w-auto sm:px-10 flex items-center justify-center gap-1 shadow-[0_0_30px_rgba(185,9,11,0.3)] transition-all hover:shadow-[0_0_40px_rgba(185,9,11,0.6)]"
            >
              Get Started
              <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}