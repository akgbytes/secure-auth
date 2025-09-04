import { createFileRoute, Link } from "@tanstack/react-router";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">SecureAuth</h1>
            </div>

            <div className="flex gap-4">
              <ModeToggle />
              <Link to="/login" className={cn(buttonVariants({ size: "lg" }))}>
                Get Started
              </Link>
            </div>
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
            <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              A powerful authentication system built with modern technologies.
              Complete flows for login, signup, email verification, password
              resets, and role-based access control.
            </p>

            <Link to="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need for Authentication
            </h2>
            <p className="text-lg text-muted-foreground">
              Built-in security features and modern authentication flows
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-sm">
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

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Email Verification</CardTitle>
                <CardDescription>
                  OTP-based email verification system to ensure user
                  authenticity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Password Recovery</CardTitle>
                <CardDescription>
                  Secure password reset flow with expiring tokens and email
                  notifications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  Role-Based Access Control
                </CardTitle>
                <CardDescription>
                  Flexible RBAC system to manage user sessions and access levels
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Auto Token Refresh</CardTitle>
                <CardDescription>
                  Seamless JWT token refresh mechanism for uninterrupted user
                  sessions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm">
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-card rounded-lg p-6 mb-4">
                  <h3 className="font-semibold text-lg">React</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Modern UI Library
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-card rounded-lg p-6 mb-4">
                  <h3 className="font-semibold text-lg">shadcn/ui</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Component Library
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-card rounded-lg p-6 mb-4">
                  <h3 className="font-semibold text-lg">Node.js</h3>
                  <p className="text-sm text-muted-foreground mt-2">Backend</p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-card rounded-lg p-6 mb-4">
                  <h3 className="font-semibold text-lg">PostgreSQL</h3>
                  <p className="text-sm text-muted-foreground mt-2">Database</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-12">
              <Badge variant="secondary">Tanstack Query</Badge>
              <Badge variant="secondary">Tanstack Router</Badge>
              <Badge variant="secondary">Drizzle ORM</Badge>
              <Badge variant="secondary">JWT Tokens</Badge>
              <Badge variant="secondary">Mailtrap</Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
