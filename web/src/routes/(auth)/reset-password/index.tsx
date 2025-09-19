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

export const Route = createFileRoute("/(auth)/reset-password/")({
  component: RouteComponent,
});

const formSchema = z.object({
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
      password: "",
    },
  });

  let isPending = false;
  return (
    <div className="flex items-center justify-center min-h-svh">
      <Card className="w-full max-w-sm sm:max-w-md rounded-xl px-6 py-8">
        <CardHeader className="text-center gap-0">
          <CardTitle>
            <h2 className="text-lg font-bold text-foreground">
              Reset your password
            </h2>
          </CardTitle>
          <CardDescription>
            <p className="text-muted-foreground text-sm pt-1">
              Enter your new password below, it must be different from old one
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={() => {}}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your new password"
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
                    "Update Password"
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
