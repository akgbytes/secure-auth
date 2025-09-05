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
import type { ApiAxiosError, ApiResponse } from "@/types";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";

import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  email: z.email("Invalid email format").trim(),
});

type FormValues = z.infer<typeof formSchema>;

export const Route = createFileRoute("/(auth)/email-resend/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: forgotPassword, isPending } = useMutation<
    ApiResponse<{
      token: string;
    }>,
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
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-foreground">
            Resend verification code
          </h2>
          <p className="text-muted-foreground text-sm pt-2">
            Enter your email address and we'll send you a new verification code
          </p>
        </div>

        <div className="py-4 w-full space-y-5">
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

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner text="Sending" />
                    </>
                  ) : (
                    <>Send Verification Code</>
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
