import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ApiAxiosError, ApiResponse } from "@/types";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";

import { ArrowLeft, MailCheck, RefreshCw } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.email("Invalid email format").trim(),
});

type FormValues = z.infer<typeof formSchema>;

export const Route = createFileRoute("/(auth)/forgot-password/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [emailSent, setEmailSent] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: forgotPassword, isPending } = useMutation<
    ApiResponse<null>,
    ApiAxiosError,
    { email: string }
  >({
    mutationFn: async (values) => {
      const response = await api.post("/auth/password/forgot", values);
      return response.data;
    },
  });

  const onSubmit = (values: FormValues) => {
    forgotPassword(values, {
      onSuccess: (res) => {
        setEmailSent(true);
        toast.success(res.message);
      },
      onError: (error) => {
        toast.error(error.response?.data.message);
      },
    });
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md border rounded px-6 py-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-foreground">
              Check your email
            </h2>
            <p className="text-muted-foreground text-sm pt-2">
              We've sent password reset instructions to your email
            </p>
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-center">
              <div className="p-4 rounded-full">
                <MailCheck className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-sm">
                We've sent a password reset link to{" "}
                <strong className="text-foreground font-medium">
                  {form.getValues("email")}
                </strong>
                . Please check your email and follow the instructions to reset
                your password.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button
                onClick={() => setEmailSent(false)}
                className="w-full cursor-pointer"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Send again
              </Button>
            </div>

            <div className="mt-6 text-center space-y-1">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  to="/signin"
                  className="text-primary hover:underline font-medium"
                >
                  Back to sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md border rounded px-6 py-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-foreground">
            Forgot your password?
          </h2>
          <p className="text-muted-foreground text-sm pt-2">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        <div className="w-full space-y-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Link
                  to="/forgot-password"
                  className="-my-3 text-left text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner text="Sending reset link" />
                    </>
                  ) : (
                    <>Send Reset Link</>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center space-y-1">
            <Link
              to="/signup"
              className="text-sm text-muted-foreground hover:text-foreground hover:underline inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>

            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
