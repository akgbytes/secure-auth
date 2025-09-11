import { createFileRoute, Link } from "@tanstack/react-router";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { FiGithub } from "react-icons/fi";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { auth } = Route.useRouteContext();
  return (
    <div className="min-h-screen">
      <header>
        <div className="container mx-auto px-16 sm:px-24 lg:px-32">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">SecureAuth</h1>
            </div>

            <a
              href="https://github.com/akgbytes/"
              aria-label="GitHub Repository"
            >
              <Button variant={"ghost"} className="cursor-pointer">
                <FiGithub />
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
              Secure Authentication
              <span className="text-primary block">Made Simple</span>
            </h1>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              A powerful authentication system built with modern technologies.
              Complete flows for login, signup, email verification, password
              resets, and role-based access control.
            </p>

            {auth.isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      className:
                        "dark:bg-blue-600 hover:dark:bg-blue-700 transition-colors duration-200 dark:text-neutral-100",
                    })
                  )}
                >
                  Go to Dashboard
                  <ArrowRight />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      className:
                        "dark:bg-blue-600 hover:dark:bg-blue-700 transition-colors duration-200 dark:text-neutral-100",
                    })
                  )}
                >
                  Get Started
                  <ArrowRight />
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need for Authentication
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border shadow-sm bg-transparent">
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

            <Card className="border shadow-sm bg-transparent">
              <CardHeader>
                <CardTitle className="text-xl">Email Verification</CardTitle>
                <CardDescription>
                  OTP-based email verification system to ensure user
                  authenticity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border shadow-sm bg-transparent">
              <CardHeader>
                <CardTitle className="text-xl">Password Recovery</CardTitle>
                <CardDescription>
                  Secure password reset flow with expiring tokens and email
                  notifications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border shadow-sm bg-transparent">
              <CardHeader>
                <CardTitle className="text-xl">
                  Role-Based Access Control
                </CardTitle>
                <CardDescription>
                  Flexible RBAC system to manage user sessions and access levels
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border shadow-sm bg-transparent">
              <CardHeader>
                <CardTitle className="text-xl">Auto Token Refresh</CardTitle>
                <CardDescription>
                  Seamless JWT token refresh mechanism for uninterrupted user
                  sessions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border shadow-sm bg-transparent">
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
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built with Modern Technologies
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Leveraging the best tools for performance, security, and developer
              experience
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="dark:bg-blue-600">
                Tanstack Query
              </Badge>
              <Badge variant="secondary" className="dark:bg-blue-600">
                Tanstack Router
              </Badge>
              <Badge variant="secondary" className="dark:bg-blue-600">
                Drizzle ORM
              </Badge>
              <Badge variant="secondary" className="dark:bg-blue-600">
                JWT Tokens
              </Badge>
              <Badge variant="secondary" className="dark:bg-blue-600">
                Mailtrap
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
