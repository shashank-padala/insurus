"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Menu,
  X,
  Home,
  Shield,
  Award,
  ListChecks,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";

export interface SideNavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SideNavProps {
  desktopItems: SideNavItem[];
  mobileItems: SideNavItem[];
  pageTitle: string;
  logoutText?: string;
  signingOutText?: string;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

export function SideNav({ 
  desktopItems,
  mobileItems,
  pageTitle, 
  logoutText = "Log Out",
  signingOutText = "Logging out...",
  onCollapseChange,
}: SideNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notify parent components of state changes
  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const handleNavigation = (url: string) => {
    router.push(url);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex fixed left-0 top-0 h-screen bg-card border-r border-border flex-col transition-all duration-300 z-50 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Header with toggle button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-accent" />
              <span className="font-heading font-bold text-xl">Insurus</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {desktopItems.map((item) => {
            const active = isActive(item.url);
            return (
              <button
                key={item.title}
                onClick={() => handleNavigation(item.url)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full cursor-pointer ${
                  active 
                    ? 'bg-accent/10 text-accent border border-accent/20' 
                    : 'text-muted-foreground hover:bg-accent/5 hover:text-foreground'
                } ${
                  isCollapsed ? 'justify-center' : ''
                }`}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-accent' : ''}`} />
                {!isCollapsed && <span>{item.title}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <button 
            className={`w-full text-sm cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-all duration-200 flex items-center px-3 py-2.5 rounded-lg text-muted-foreground ${
              isCollapsed ? 'justify-center px-2' : 'justify-start'
            }`}
            onClick={handleLogout}
            disabled={isLoggingOut}
            title={isCollapsed ? logoutText : undefined}
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 flex-shrink-0" />
            )}
            {!isCollapsed && (
              <span className="ml-2">
                {isLoggingOut ? signingOutText : logoutText}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around h-16 px-2">
          {mobileItems.map((item) => {
            const active = isActive(item.url);
            return (
              <button
                key={item.title}
                onClick={() => handleNavigation(item.url)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 flex-1 max-w-[25%] ${
                  active 
                    ? 'text-accent' 
                    : 'text-muted-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-accent' : ''}`} />
                <span className="text-xs font-medium">{item.title}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Sidebar Sheet (for additional options like logout) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-center px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-accent" />
                <span className="font-heading font-bold text-xl">Insurus</span>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {mobileItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <button
                    key={item.title}
                    onClick={() => handleNavigation(item.url)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 w-full cursor-pointer ${
                      active 
                        ? 'bg-accent/10 text-accent border border-accent/20' 
                        : 'text-muted-foreground hover:bg-accent/5 hover:text-foreground'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-accent' : ''}`} />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Logout Button */}
            <div className="p-4 border-t border-border">
              <button 
                className="w-full text-base cursor-pointer justify-start hover:bg-destructive/10 hover:text-destructive transition-all duration-200 flex items-center px-3 py-3 rounded-lg text-muted-foreground"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="ml-3">
                  {isLoggingOut ? signingOutText : logoutText}
                </span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

