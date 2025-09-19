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
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { useMutation } from "@tanstack/react-query";
import type { ApiAxiosError, ApiResponse, User } from "@/types";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export const Route = createFileRoute("/(auth)/signup/")({
  component: RouteComponent,
});

const formSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must contain 2 or more characters" })
    .max(50, { error: "Password must contain less than 50 characters" }),

  email: z.email("Invalid email format").trim(),
  password: z
    .string()
    .min(6, { error: "Password must contain 8 or more characters" })
    .max(72, { error: "Password must contain less than 72 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

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

  const { mutate: register, isPending } = useMutation<
    ApiResponse<User>,
    ApiAxiosError,
    FormValues
  >({
    mutationFn: async (values) => {
      const response = await api.post("/auth/register", values);
      return response.data;
    },
  });

  const onSubmit = (values: FormValues) => {
    register(values, {
      onSuccess: (res) => {
        toast.success(res.message);
        navigate({
          to: "/signin",
        });
      },
      onError: (error) => {
        toast.error(error.response?.data.message);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-svh">
      <Card className="w-full rounded-xl max-w-sm px-2 py-4 sm:max-w-md sm:px-6 sm:py-8">
        <CardHeader className="text-center gap-0">
          <CardTitle>
            <h2 className="text-lg font-bold text-foreground">
              Create your account
            </h2>
          </CardTitle>
          <CardDescription>
            <p className="text-muted-foreground text-sm pt-1">
              Welcome! Please fill in the details to get started.
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your name"
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
  );
}
