import { Button, buttonVariants } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FiGithub } from "react-icons/fi";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { ModeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserButton from "@/components/UserButton";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const isAuthenticated = true;
  return (
    <div className="container mx-auto px-8 sm:px-24 lg:px-32 space-y-32 mb-24">
      <header>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <IconInnerShadowTop className="size-5" />
            <h1 className="text-xl font-bold">SecureAuth</h1>
          </div>

          <div className="flex gap-2">
            <ModeToggle />
            <a
              href="https://github.com/akgbytes/secure-auth"
              aria-label="GitHub Repo"
              target="_blank"
            >
              <Button variant={"ghost"} className="cursor-pointer">
                <FiGithub className="size-4" />
              </Button>
            </a>

            {isAuthenticated && (
              <UserButton
                email="akgbytes@gmail.com"
                name="Aman Gupta"
                image=""
              />
            )}
          </div>
        </div>
      </header>

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

        {isAuthenticated ? (
          <div className="mt-4">
            <Link
              to="/dashboard"
              className={cn(
                buttonVariants({
                  size: "lg",
                })
              )}
            >
              Go to Dashboard
              <ArrowRight />
            </Link>
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
              <CardTitle className="text-xl">
                Secure Login & Registration
              </CardTitle>
              <CardDescription>
                Complete user authentication flows with JWT access and refresh
                tokens
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Email Verification</CardTitle>
              <CardDescription>
                OTP-based email verification system to ensure user authenticity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Password Recovery</CardTitle>
              <CardDescription>
                Secure password reset flow with expiring tokens and email
                notifications
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">
                Role-Based Access Control
              </CardTitle>
              <CardDescription>
                Flexible RBAC system to manage user sessions and access levels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Auto Token Refresh</CardTitle>
              <CardDescription>
                Seamless JWT token refresh mechanism for uninterrupted user
                sessions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">
                Role-Based Access Control
              </CardTitle>
              <CardDescription>
                Flexible RBAC system to manage user sessions and access levels
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
            <Badge>Tanstack Query</Badge>
            <Badge>Tanstack Router</Badge>
            <Badge>Drizzle ORM</Badge>
            <Badge>JWT Tokens</Badge>
            <Badge>Mailtrap</Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
