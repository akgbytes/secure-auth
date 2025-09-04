import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { RegisterResponse, ApiAxiosError, RegisterInput } from "@/types";
import { toast } from "sonner";

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
    RegisterResponse,
    ApiAxiosError,
    RegisterInput
  >({
    mutationFn: async (values) => {
      const response = await api.post("/auth/signup", values);
      return response.data;
    },
  });

  const onSubmit = (values: FormValues) => {
    signupUser(values, {
      onSuccess: (res) => {
        console.log(res);
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
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold text-primary mb-2">SecureAuth</h1>
          </Link>
          <h2 className="text-xl font-semibold text-foreground">
            Create your account
          </h2>
          <p className="text-muted-foreground">
            Get started with SecureAuth today
          </p>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Create a new account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                              placeholder="Aman Gupta"
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
                              placeholder="akgbytes@gmail.com"
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
                              placeholder="********"
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
