"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import type { User } from "@supabase/supabase-js";

// Define public pages that DON'T require authentication
const PUBLIC_ROUTES = ["/landing", "/home", "/login"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Auth Error:", error.message);
        return;
      }
      setUser(data?.user || null);
    };

    fetchUser();

    // Listen for authentication state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Only redirect if the user is NOT logged in and trying to access a PROTECTED page
  useEffect(() => {
    if (!user && !PUBLIC_ROUTES.includes(pathname)) {
      router.push("/login");
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}
