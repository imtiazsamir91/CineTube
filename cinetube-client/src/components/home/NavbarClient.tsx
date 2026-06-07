"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, User, LogOut, LayoutDashboard, Loader2, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/service/auth.services";
import { getMyNotifications } from "@/service/notificationService";

export default function NavbarClient({ initialUser }: { initialUser: any }) {
  const router = useRouter();
  const [subData, setSubData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 

  const isAdmin = initialUser?.role === "ADMIN";
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

 
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/allmovie?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [subRes, notifRes] = await Promise.allSettled([
          fetch(`${API_URL}/subscription/my-status`, { credentials: "include" }).then(r => r.json()),
          getMyNotifications()
        ]);

        if (subRes.status === "fulfilled" && subRes.value?.success) {
          setSubData(subRes.value.data);
        }
        
        if (notifRes.status === "fulfilled") {
          const result = notifRes.value as any;
          const data = Array.isArray(result) ? result : (result?.data || []);
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error loading navbar data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (initialUser) fetchData();
    else setIsLoading(false);
  }, [initialUser, API_URL]);

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/login";
  };

  return (
    <header className="relative z-50 flex w-full items-center justify-between px-4 py-4 md:px-16 bg-black border-b border-zinc-800 gap-4">
      <div className="text-2xl font-extrabold tracking-tighter text-[#B9090B] cursor-pointer" onClick={() => router.push('/')}>
        CINETUBE
      </div>

      <div className="flex flex-grow items-center bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 focus-within:border-[#B9090B] transition-all w-full max-w-sm md:max-w-md mx-4">
        <Search className="w-5 h-5 text-zinc-500 mr-3" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-white w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="flex items-center gap-4">
        {initialUser ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 hover:bg-zinc-800 rounded-full transition">
                  <Bell className="w-5 h-5 text-white" />
                  {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-[#B9090B] rounded-full" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-zinc-900 border-zinc-800 text-white mt-2" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                {notifications.length > 0 ? (
                  notifications.map((n: any) => (
                    <DropdownMenuItem key={n.id} className="text-xs py-3 border-b border-zinc-800 cursor-default">
                      {n.message}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-zinc-500">No new notifications</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 hover:border-[#B9090B] flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-zinc-900 border-zinc-800 text-white mt-2" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm">{initialUser.name}</span>
                    <span className="text-xs text-zinc-500">{initialUser.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push("/admin/dashboard")} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="cursor-pointer" disabled>
                  <div className="flex flex-col w-full gap-1">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Subscription</span>
                      <span className="text-[#B9090B] font-bold">
                        {isLoading ? <Loader2 className="animate-spin w-3 h-3" /> : (subData?.status || "Free")}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500">Plan: {subData?.planType || "N/A"}</div>
                    {subData?.endDate && (
                      <div className="text-xs text-zinc-500 mt-1">
                        Expires: {new Date(subData.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button onClick={() => router.push("/login")} className="bg-[#B9090B]">Sign In</Button>
        )}
      </div>
    </header>
  );
}