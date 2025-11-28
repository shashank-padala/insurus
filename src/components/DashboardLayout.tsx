"use client";

import { ReactNode } from "react";
import {
  LayoutDashboard,
  Home,
  Award,
  ListChecks,
  User,
} from "lucide-react";
import { SideNav, SideNavItem } from "@/components/SideNav";
import { PromotionalBanner } from "@/components/PromotionalBanner";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Desktop sidebar: all 5 items including Dashboard
  const desktopItems: SideNavItem[] = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Properties", url: "/properties", icon: Home },
    { title: "Tasks", url: "/tasks", icon: ListChecks },
    { title: "Rewards", url: "/rewards", icon: Award },
    { title: "Profile", url: "/profile", icon: User },
  ];

  // Mobile bottom nav: 4 items (no Dashboard)
  const mobileItems: SideNavItem[] = [
    { title: "Tasks", url: "/tasks", icon: ListChecks },
    { title: "Properties", url: "/properties", icon: Home },
    { title: "Rewards", url: "/rewards", icon: Award },
    { title: "Profile", url: "/profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <SideNav 
        desktopItems={desktopItems}
        mobileItems={mobileItems}
        pageTitle="Insurus"
        logoutText="Log Out"
        signingOutText="Logging out..."
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 pb-16 md:pb-0">
        <PromotionalBanner />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

