import { Button, buttonVariants } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ArrowRight, Heart } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import {
  IconClock,
  IconKey,
  IconLock,
  IconMailCheck,
  IconRefresh,
  IconShieldCheck,
} from "@tabler/icons-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { auth } = Route.useRouteContext();
  return (
    <div className="container mx-auto px-8 sm:px-24 lg:px-32 space-y-32 mb-24">
      <Navbar />

      {/* hero-section */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-4">
          Secure Authentication{" "}
          <span className="px-2 text-[#117149]">Simplified</span>
        </h2>

        <p className="text-base sm:text-lg text-foreground">
          An end-to-end authentication project built to practice modern security
          best practices. It covers the complete flow of user management
          implemented from scratch to strengthen my understanding of
          authentication systems.
        </p>

        {auth.isAuthenticated ? (
          <div className="mt-6">
            <Button
              className=""
              size="lg"
              onClick={() => {
                toast.info("Click on user button to explore features");
              }}
            >
              Explore features
              <ArrowRight />
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <Link
              to="/signin"
              className={cn(
                buttonVariants({
                  size: "lg",
                })
              )}
            >
              Get Started
              <ArrowRight />
            </Link>
          </div>
        )}
      </div>

      {/* features section */}
      <section>
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl text-center sm:text-4xl font-bold mb-8">
            Everything You Need for Authentication
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex gap-2 items-center">
                <span>Secure Login & Registration</span>
                <IconLock className="size-5" />
              </CardTitle>
              <CardDescription>
                Complete user authentication flows with JWT access and refresh
                tokens
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex gap-2 items-center">
                <span>Email Verification</span>
                <IconMailCheck className="size-5" />
              </CardTitle>
              <CardDescription>
                Simple and secure email verification using time-bound magic
                links ensures only real users get in.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex gap-2 items-center">
                <span>Password Recovery</span>
                <IconKey className="size-5" />
              </CardTitle>
              <CardDescription>
                Secure password reset flow with expiring tokens and email
                notifications
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex gap-2 items-center">
                <span>Role-Based Access Control</span>
                <IconShieldCheck className="size-5" />
              </CardTitle>
              <CardDescription>
                Fine-grained permissions to separate users, admins, and more.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex gap-2 items-center">
                <span>Session Management</span>
                <IconClock className="size-5" />
              </CardTitle>

              <CardDescription>
                Track and revoke active sessions across devices in real time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex gap-2 items-center">
                <span>Automatic Token Refresh</span>
                <IconRefresh className="size-5" />
              </CardTitle>

              <CardDescription>
                Seamless background refresh keeps users logged in without
                interruptions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            Built with Modern Technologies
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Leveraging the best tools for performance, security, and developer
            experience
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge>React + shadCN</Badge>
            <Badge>Tanstack Router</Badge>
            <Badge>Tanstack Query</Badge>
            <Badge>Drizzle ORM</Badge>
            <Badge>JWT & JOSE</Badge>
            <Badge>Mailtrap</Badge>
            <Badge>Cloudinary</Badge>
            <Badge>Winston</Badge>
          </div>
        </div>
      </section>

      <footer className="text-center">
        <span>
          Made with <Heart className="inline border-none size-5" /> by{" "}
        </span>
        <a
          href="https://x.com/akgbytes"
          aria-label="twitter"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:text-lime-600 hover:underline"
        >
          akgbytes
        </a>
      </footer>
    </div>
  );
}
