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
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import type { ApiAxiosError, ApiResponse } from "@/types";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store";
import { toast } from "sonner";
import { fetchUser } from "@/services/user.service";

export const Route = createFileRoute("/(auth)/signin/")({
  component: RouteComponent,
});

const formSchema = z.object({
  email: z.email("Invalid email format").trim(),
  password: z
    .string()
    .min(6, { error: "Password must contain 8 or more characters" })
    .max(72, { error: "Password must contain less than 72 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

function RouteComponent() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useMutation<
    ApiResponse<null>,
    ApiAxiosError,
    FormValues
  >({
    mutationFn: async (values) => {
      const response = await api.post("/auth/login", values);
      return response.data;
    },
  });

  const onSubmit = (values: FormValues) => {
    login(values, {
      onSuccess: async (res) => {
        toast.success(res.message);
        try {
          const user = await fetchUser();
          setUser(user);
          navigate({ to: "/dashboard" });
        } catch (err) {
          toast.error("Failed to fetch user details");
        }
      },
      onError: (error) => {
        toast.error(error.response?.data.message);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-svh">
      <Card className="w-full max-w-sm sm:max-w-md rounded-xl px-6 py-8">
        <CardHeader className="text-center gap-0">
          <CardTitle>
            <h2 className="text-lg font-bold text-foreground">
              Sign in to SecureAuth
            </h2>
          </CardTitle>
          <CardDescription>
            <p className="text-muted-foreground text-sm pt-1">
              Welcome back! Please sign in to continue
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-col">
            <Button
              size={"sm"}
              className="w-full cursor-pointer"
              variant={"outline"}
            >
              <FcGoogle className="size-4" />
              <span className="text-muted-foreground">Google</span>
            </Button>
            <Button
              size={"sm"}
              className="w-full cursor-pointer"
              variant={"outline"}
            >
              <FaGithub className="size-4" />
              <span className="text-muted-foreground">Github</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-semibold">
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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          {" "}
                          <FormLabel>Password</FormLabel>
                          <Link
                            className="text-sm text-muted-foreground hover:text-foreground"
                            to="/forgot-password"
                          >
                            Forgot Password
                          </Link>
                        </div>
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
                    "Continue"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
