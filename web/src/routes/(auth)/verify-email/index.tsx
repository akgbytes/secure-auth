import Spinner from "@/components/Spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, XCircle } from "lucide-react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/(auth)/verify-email/")({
  component: RouteComponent,
});

function RouteComponent() {
  const renderContent = (): ReactNode => {
    if (true) {
      return (
        <>
          <CardHeader className="text-center gap-0">
            <CardTitle>
              <h2 className="text-lg font-bold text-foreground">
                Verifying your email
              </h2>
            </CardTitle>
            <CardDescription>
              <p className="text-muted-foreground text-sm pt-1">
                Please wait while we verify your email address.
              </p>
            </CardDescription>
          </CardHeader>

          <CardContent className="mx-auto">
            <Spinner className="size-8 text-green-800" />
          </CardContent>
        </>
      );
    } else {
      //   return (
      //     <>
      //       <CardHeader className="text-center gap-0">
      //         <CardTitle>
      //           <h2 className="text-lg font-bold text-foreground flex gap-2 items-center justify-center">
      //             Email Verified
      //             <CheckCircle className="size-5 text-green-500" />
      //           </h2>
      //         </CardTitle>
      //       </CardHeader>

      //       <CardContent className="space-y-4">
      //         <p className="text-muted-foreground text-sm pt-1 text-center">
      //           Your email has been successfully verified. <br /> You can now
      //           access all features of your account.
      //         </p>

      //         <Link
      //           to="/dashboard"
      //           className={buttonVariants({ size: "sm", className: "w-full cursor-pointer" })}
      //         >
      //           Go to Dashboard
      //         </Link>
      //       </CardContent>
      //     </>
      //   );
      return (
        <>
          <CardHeader className="text-center gap-0">
            <CardTitle>
              <h2 className="text-lg font-bold text-foreground flex gap-2 items-center justify-center">
                Verification Failed
                <XCircle className="size-5 text-red-500" />
              </h2>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm pt-1 text-center">
              We couldn't verify your email. <br />
              The link may be invalid or expired.
            </p>

            <Link
              to="/dashboard"
              className={buttonVariants({
                size: "sm",
                className: "w-full cursor-pointer",
              })}
            >
              Resend Verification Email
            </Link>
          </CardContent>
        </>
      );
    }
  };
  return (
    <div className="flex items-center justify-center min-h-svh">
      <Card className="w-full max-w-sm sm:max-w-md rounded-xl px-10 py-8 gap-4 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
        {renderContent()}
      </Card>
    </div>
  );
}
