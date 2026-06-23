"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, Video, FolderOpen, Settings, LayoutDashboard, Menu, X, LogOut 
} from "lucide-react";

interface SidebarLink {
  name: string;
  icon: React.ReactNode;
  href: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sideMenuLinks: SidebarLink[] = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/admin/dashboard" },
    { name: "Manage Content", icon: <Video size={20} />, href: "/admin/content" },
    { name: "Categories", icon: <FolderOpen size={20} />, href: "/admin/categories" },
    { name: "Users Management", icon: <Users size={20} />, href: "/admin/users" },
    { name: "Settings", icon: <Settings size={20} />, href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      
      
      <aside 
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-slate-900 text-white transform 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 ease-in-out border-r border-slate-800 flex flex-col justify-between`}
      >
        <div>
          <div className="p-6 flex items-center justify-between border-b border-slate-800">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Admin Panel</span>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {sideMenuLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={idx} 
                  href={link.href} 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-indigo-600 text-white" 
                      : "text-gray-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

   
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "lg:pl-64" : "lg:pl-0"}`}>
        
      
        <header className="bg-white h-16 border-b border-gray-100 flex items-center px-6 justify-between sticky top-0 z-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100">
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">A</div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin Account</span>
          </div>
        </header>

       
        <main className="p-6 max-w-7xl w-full mx-auto space-y-8 flex-1">
          {children} 
        </main>
      </div>
    </div>
  );
}