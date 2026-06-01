// src/app/page.tsx (অথবা যেখানে আপনার LandingPage আছে)
"use client";

import { useRouter } from "next/navigation";


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

      
    

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center text-white">
       
        <div className="max-w-4xl space-y-4 md:space-y-6">
          
        </div>
      </main>
    </div>
  );
}