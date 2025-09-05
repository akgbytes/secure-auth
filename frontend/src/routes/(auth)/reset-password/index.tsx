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

const formSchema = z.object({
  password: z
    .string()
    .trim()
    .min(6, { error: "Password must be at least 6 characters long" })
    .max(64, { error: "Password must be at most 64 characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

export const Route = createFileRoute("/(auth)/reset-password/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string,
  }),
});

function RouteComponent() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      password: "",
    },
  });

  const { mutate: resetPassword, isPending } = useMutation<
    ApiResponse<null>,
    ApiAxiosError,
    { token: string; password: string }
  >({
    mutationFn: async (values) => {
      const response = await api.post("/auth/password/reset", values);
      return response.data;
    },
  });

  const onSubmit = (values: FormValues) => {
    resetPassword(
      { password: values.password, token: token },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          navigate({ to: "/signin" });
        },
        onError: (error) => {
          toast.error(error.response?.data.message);
          form.reset();
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md border rounded px-6 py-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-foreground">
            Reset your password
          </h2>
          <p className="text-muted-foreground text-sm pt-2">
            Enter your new password below, it must be different from old one
          </p>
        </div>

        <div className="w-full space-y-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                            placeholder="Enter new password"
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
                      <Spinner text="Updating" />
                    </>
                  ) : (
                    <>Update Password</>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center">
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
