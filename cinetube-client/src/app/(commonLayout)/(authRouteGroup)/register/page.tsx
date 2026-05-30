"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/service/auth.services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await registerUser({ name, email, password });

      if (res?.success) {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error?.message || "Registration failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription>
            Enter your details below to create your CineTube account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Full Name</label>
              <Input 
                id="name" 
                name="name" 
                type="text" 
                placeholder="John Doe" 
                required 
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email Address</label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                disabled={isPending}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating Account..." : "Register"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <button 
              onClick={() => router.push("/login")} 
              className="font-medium text-primary underline underline-offset-4"
            >
              Login here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}