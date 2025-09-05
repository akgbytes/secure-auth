import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import type { ApiAxiosError, ApiResponse, SignInInput } from "@/types";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const formSchema = z.object({
  email: z.email("Invalid email format").trim(),
  password: z
    .string()
    .trim()
    .min(6, { error: "Password must be at least 6 characters long" })
    .max(64, { error: "Password must be at most 64 characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

export const Route = createFileRoute("/(auth)/signin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: signupUser, isPending } = useMutation<
    ApiResponse<null>,
    ApiAxiosError,
    SignInInput
  >({
    mutationFn: async (values) => {
      const response = await api.post("/auth/signup", values);
      return response.data;
    },
  });

  const onSubmit = (values: FormValues) => {
    signupUser(values, {
      onSuccess: (res) => {
        toast.success(res.message);
        navigate({ to: "/dashboard" });
      },
      onError: (error) => {
        toast.error(error.response?.data.message);
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md border rounded px-6 py-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-foreground">
            Welcome back
          </h2>
          <p className="text-muted-foreground text-sm pt-2">
            Sign in to your account
          </p>
        </div>

        <div className="w-full space-y-5">
          <GoogleLoginButton isPending={isPending} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-semibold">
                OR
              </span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
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
                      <Spinner text="Signing in" />
                    </>
                  ) : (
                    "Sign In with Email"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>

            <p className="text-sm text-muted-foreground">
              Need to verify your email?{" "}
              <Link
                to="/email-resend"
                className="text-primary hover:underline font-medium"
              >
                Resend verification
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
