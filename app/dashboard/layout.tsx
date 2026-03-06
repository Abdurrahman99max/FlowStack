import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, onboarding_complete, role_id, roles(name, slug)")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_complete) {
    redirect("/onboarding");
  }

  const roleName =
    (profile?.roles as unknown as { name: string })?.name || "Explorer";
  const roleSlug = (profile?.roles as unknown as { slug: string })?.slug || "";
  const displayName =
    profile?.display_name || user.email?.split("@")[0] || "User";

  return (
    <DashboardShell
      user={{
        id: user.id,
        email: user.email || "",
        displayName,
        roleName,
        roleSlug,
      }}
    >
      {children}
    </DashboardShell>
  );
}
