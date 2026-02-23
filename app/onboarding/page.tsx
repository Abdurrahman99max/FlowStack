import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if onboarding already completed
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", user.id)
    .single()

  if (profile?.onboarding_complete) {
    redirect("/dashboard")
  }

  // Fetch roles and tasks for the wizard
  const { data: roles } = await supabase
    .from("roles")
    .select("id, name, slug, description, icon")
    .order("display_order", { ascending: true })

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, name, slug, description")
    .order("name", { ascending: true })

  return (
    <OnboardingWizard
      userId={user.id}
      roles={roles || []}
      tasks={tasks || []}
    />
  )
}
