// src/components/Navbar.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();

  return (
    // bg-black ক্লাসটি এখানে যোগ করা হয়েছে
    <header className="relative z-50 flex w-full items-center justify-between px-6 py-6 md:px-16 bg-black">
      <div 
        className="text-3xl font-extrabold tracking-tighter text-[#B9090B] md:text-4xl cursor-pointer" 
        onClick={() => router.push('/')}
      >
        CINETUBE
      </div>
      <Button 
        onClick={() => router.push("/login")}
        className="h-9 bg-[#B9090B] px-4 text-sm font-semibold text-white hover:bg-[#990708] active:bg-[#780506]"
      >
        Sign In
      </Button>
    </header>
  );
}