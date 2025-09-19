import Spinner from "@/components/Spinner";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/axios";
import type { ApiAxiosError, ApiResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/(auth)/verify-email/")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { token } = Route.useSearch();

  const {
    mutate: verifyEmail,
    isPending,
    isSuccess,
    isError,
  } = useMutation<ApiResponse<null>, ApiAxiosError, { token: string }>({
    mutationFn: async (values) => {
      const response = await api.post("auth/email/verify", values);
      return response.data;
    },
  });

  useEffect(() => {
    verifyEmail(
      { token: token },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          navigate({ to: "/signin" });
        },
        onError: (error) => {
          toast.error(error.response?.data.message);
        },
      }
    );
  }, []);

  const renderContent = (): ReactNode => {
    if (isPending) {
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
    } else if (isSuccess) {
      return (
        <>
          <CardHeader className="text-center gap-0">
            <CardTitle>
              <h2 className="text-lg font-bold text-foreground flex gap-2 items-center justify-center">
                Email Verified
                <CheckCircle className="size-5 text-green-500" />
              </h2>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm pt-1 text-center">
              Your email has been successfully verified. <br /> You can now
              access all features of your account.
            </p>

            <Link
              to="/dashboard"
              className={buttonVariants({
                size: "sm",
                className: "w-full cursor-pointer",
              })}
            >
              Go to Dashboard
            </Link>
          </CardContent>
        </>
      );
    } else if (isError) {
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
    } else {
      return null;
    }
  };
  return (
    <div className="flex items-center justify-center min-h-svh">
      <Card className="w-full max-w-sm sm:max-w-md rounded-xl px-10 py-8 gap-4">
        {renderContent()}
      </Card>
    </div>
  );
}
