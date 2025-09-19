import { createFileRoute, Link } from "@tanstack/react-router";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import type { ApiAxiosError, ApiResponse } from "@/types";
import { api } from "@/lib/axios";
import { useState } from "react";
import { toast } from "sonner";
import { MailCheck, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/(auth)/forgot-password/")({
  component: RouteComponent,
});

const formSchema = z.object({
  email: z.email("Invalid email format").trim(),
});

type FormValues = z.infer<typeof formSchema>;

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
      <div className="flex items-center justify-center min-h-svh">
        <Card className="w-full max-w-sm sm:max-w-md rounded-xl px-6 py-8">
          <CardHeader className="text-center gap-0">
            <CardTitle>
              <h2 className="text-lg font-bold text-foreground flex gap-2 items-center justify-center">
                Reset link sent
                <MailCheck className="size-5 text-green-500" />
              </h2>
            </CardTitle>
            <CardDescription>
              <p className="text-muted-foreground text-sm pt-1">
                We&apos;ve sent password reset instructions to your email
              </p>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-center">
              We've sent a password reset link to{" "}
              <strong className="text-foreground font-medium">
                {form.getValues("email")}
              </strong>
              . Please check your email and follow the instructions to reset
              your password.
            </p>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button
                onClick={() => {
                  setEmailSent(false);
                }}
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
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-svh">
      <Card className="w-full max-w-sm sm:max-w-md rounded-xl px-6 py-8">
        <CardHeader className="text-center gap-0">
          <CardTitle>
            <h2 className="text-lg font-bold text-foreground">
              Forgot your password?
            </h2>
          </CardTitle>
          <CardDescription>
            <p className="text-muted-foreground text-sm pt-1">
              Enter your email address and we&apos;ll send you a link to reset
              your password
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
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
                <Button
                  size="sm"
                  type="submit"
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Spinner />
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                to="/signin"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
