"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AuthGuard = ({ requiredRole, children }: { requiredRole: string; children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", user.email)
        .single();

      if (error || !data) {
        router.push("/login");
        return;
      }

      setRole(data.role);
      setLoading(false);
    };

    fetchUserRole();
  }, [router]);

  if (loading) return <div className="text-center py-10">Checking authentication...</div>;

  // Redirect to correct dashboard if the user has a different role
  if (role && role !== requiredRole) {
    if (role === "client") router.push("/home");
    else if (role === "agency") router.push("/agency-dashboard");
    else if (role === "admin") router.push("/admin-dashboard");
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
