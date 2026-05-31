"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { loginAction } from "./_action";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = (await loginAction({ email, password })) as any;

      if (res && "accessToken" in res) {
        toast.success("Welcome back to CineTube!");
        queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        router.push("/");
        router.refresh();
      } else {
        toast.error(res?.message || "Invalid email or password.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div 
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat px-4 before:absolute before:inset-0 before:bg-black/60 before:content-['']"
      style={{
        backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/740dc2c6-edde-4c86-8320-5dfd66bf0da9/web/BD-en-20260127-TRIFECTA-perspective_20696eb6-38b4-4fa4-9279-d3e91340156a_large.jpg')",
      }}
    >
      <Card className="relative z-10 w-full max-w-[450px] border-none bg-black/75 px-4 py-8 text-white backdrop-blur-sm sm:px-8">
        <CardHeader className="space-y-1 p-4">
          <CardTitle className="text-3xl font-bold tracking-tight">Sign In</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div className="space-y-1">
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="Email or mobile number" 
                required 
                disabled={isPending}
                className="h-12 border-none bg-[#333] text-white placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Password" 
                required 
                disabled={isPending}
                className="h-12 border-none bg-[#333] text-white placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-500"
              />
            </div>
            <Button 
              type="submit" 
              className="h-12 w-full bg-[#B9090B] text-base font-semibold hover:bg-[#990708] active:bg-[#780506]" 
              disabled={isPending}
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#B9090B] h-4 w-4" />
              Remember me
            </label>
            <button className="hover:underline">Need help?</button>
          </div>

          <div className="mt-8 text-zinc-400 text-sm">
            New to CineTube?{" "}
            <button 
              onClick={() => router.push("/register")} 
              className="font-medium text-white hover:underline"
            >
              Sign up now
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}