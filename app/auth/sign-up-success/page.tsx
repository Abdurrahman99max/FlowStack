import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="w-full max-w-sm">
      <Card className="border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-serif text-2xl font-bold text-foreground">
            Check your email
          </CardTitle>
          <CardDescription>
            {"We've sent a confirmation link to your inbox"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            Click the link in your email to verify your account. Once confirmed,
            you can sign in and start building your personalized AI stack.
          </p>
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              {"Don't see the email? Check your spam folder. It can take up to a minute to arrive."}
            </p>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/auth/login">Back to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
