import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import api from "@/lib/axios";
import type { ApiAxiosError, ApiResponse, VerifyEmailInput } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
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
  const { mutate: verifyEmail, isPending } = useMutation<
    ApiResponse<null>,
    ApiAxiosError,
    VerifyEmailInput
  >({
    mutationFn: async (values) => {
      const response = await api.post("auth/email/verify", values);
      return response.data;
    },
  });

  const [otp, setOtp] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    verifyEmail(
      { token: token, otp: otp },
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
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md border rounded px-6 py-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-foreground">
            Verify your email
          </h2>
          <p className="pt-2 text-muted-foreground text-sm">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="w-full space-y-5">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value.replace(/\D/g, ""))}
                  pattern="[0-9]*"
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} inputMode="numeric" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || otp.length !== 6}
            >
              {isPending ? <Spinner text="Verifying" /> : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <div className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-all duration-200">
              <Link to="/email-resend">Resend verification code</Link>
            </div>

            <p className="text-sm text-muted-foreground">
              Wrong email?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium transition-all duration-200"
              >
                Go back to sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
