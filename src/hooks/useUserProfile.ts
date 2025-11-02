import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useUserRole = (userId: string | undefined) => {
  const { data: profile } = useUserProfile(userId);
  return profile?.role || null;
};

export const hasRole = (userRole: string | null, allowedRoles: string[]) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};
