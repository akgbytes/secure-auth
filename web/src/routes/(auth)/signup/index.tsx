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
import { createFileRoute, Link } from "@tanstack/react-router";
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

export const Route = createFileRoute("/(auth)/signup/")({
  component: RouteComponent,
});

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

function RouteComponent() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  let isPending = false;
  const onSubmit = async (e: any) => {
    e.preventDefault();
    console.log("sdsd");
    window.location.href = "http://localhost:8080/api/v1/auth/login/google";
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
