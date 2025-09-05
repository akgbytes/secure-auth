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
import type { ApiAxiosError, SignUpInput, SignUpResponse } from "@/types";
import { toast } from "sonner";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import Spinner from "@/components/Spinner";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters long" })
    .max(50, { error: "Name must be less than 50 characters" }),

  email: z.email("Invalid email format").trim(),
  password: z
    .string()
    .trim()
    .min(6, { error: "Password must be at least 6 characters long" })
    .max(64, { error: "Password must be at most 64 characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

export const Route = createFileRoute("/(auth)/signup/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate: signupUser, isPending } = useMutation<
    SignUpResponse,
    ApiAxiosError,
    SignUpInput
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
        navigate({
          to: "/email-verify",
          search: {
            token: res.data.token,
          },
        });
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
            Create your account
          </h2>
          <p className="text-muted-foreground text-sm pt-2">
            Get started with SecureAuth today
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Email your name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            placeholder="Enter a strong password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner text="Signing up" />
                    </>
                  ) : (
                    "Sign Up with Email"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
