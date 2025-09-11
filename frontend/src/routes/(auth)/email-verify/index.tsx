import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import type { ApiAxiosError, ApiResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/(auth)/email-verify/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string,
  }),
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

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Verifying your email</h2>
            <p className="text-zinc-300 text-sm mt-1">
              Please wait while we verify your email address
            </p>
          </div>
        </div>
      );
    } else if (isSuccess) {
      return (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Email Verified</h2>
            <p className="text-zinc-300">
              Your email has been successfully verified. You can now access all
              features of your account.
            </p>
          </div>
          <Link to="/signin">
            <Button className="w-full cursor-pointer">Continue to Login</Button>
          </Link>
        </div>
      );
    } else if (isError) {
      return (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
            <p className="text-zinc-400">
              We couldn't verify your email. The link may be invalid or expired.
            </p>
          </div>
          <Link to="/email-resend">
            <Button className="w-full cursor-pointer">
              Resend Verification Email
            </Button>
          </Link>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border dark:border-neutral-900 rounded px-6 py-8 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-foreground">
            Email Verification
          </h2>
          <p className="pt-2 text-zinc-300 text-sm">
            Verify your email address to complete registration
          </p>
        </div>

        <div className="w-full">{renderContent()}</div>
      </div>
    </div>
  );
}
