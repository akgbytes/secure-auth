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

export const Route = createFileRoute("/(auth)/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onSubmit = async (e: any) => {
    e.preventDefault();
    console.log("sdsd");
    window.location.href = "http://localhost:8080/api/v1/auth/login/google";
  };
  return (
    <div></div>
    // <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
    //   <div className="w-full max-w-md border dark:border-neutral-900 rounded px-6 py-8 shadow-2xl">
    //     <div className="text-center mb-6">
    //       <h2 className="text-3xl font-semibold text-foreground">
    //         Create your account
    //       </h2>
    //       <p className="text-zinc-300 text-sm pt-2">
    //         Get started with SecureAuth today
    //       </p>
    //     </div>

    //     <div className="w-full space-y-5">
    //       {/* <GoogleLoginButton isPending={isPending} /> */}
    //       <Button>Google Login</Button>

    //       <div className="relative">
    //         <div className="absolute inset-0 flex items-center">
    //           <span className="w-full border-t border-border" />
    //         </div>
    //         <div className="relative flex justify-center text-xs uppercase">
    //           <span className="bg-neutral-900 px-2 text-muted-foreground font-semibold">
    //             OR
    //           </span>
    //         </div>
    //       </div>

    //       <Form {...form}>
    //         <form onSubmit={form.handleSubmit(onSubmit)}>
    //           <div className="flex flex-col gap-6">
    //             <div className="grid gap-4">
    //               <FormField
    //                 control={form.control}
    //                 name="name"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Name</FormLabel>
    //                     <FormControl>
    //                       <Input
    //                         type="text"
    //                         placeholder="Enter your name"
    //                         {...field}
    //                       />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 control={form.control}
    //                 name="email"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Email</FormLabel>
    //                     <FormControl>
    //                       <Input
    //                         type="email"
    //                         placeholder="Enter your email"
    //                         {...field}
    //                       />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 control={form.control}
    //                 name="password"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Password</FormLabel>
    //                     <FormControl>
    //                       <Input
    //                         type="password"
    //                         placeholder="Enter a strong password"
    //                         {...field}
    //                       />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //             </div>
    //             <Button type="submit" className="w-full" disabled={isPending}>
    //               {isPending ? (
    //                 <>
    //                   <Spinner />
    //                 </>
    //               ) : (
    //                 "Sign Up with Email"
    //               )}
    //             </Button>
    //           </div>
    //         </form>
    //       </Form>

    //       <div className="mt-6 text-center">
    //         <p className="text-sm text-muted-foreground">
    //           Already have an account?{" "}
    //           <Link
    //             to="/login"
    //             className="text-primary hover:underline font-medium"
    //           >
    //             Sign in
    //           </Link>
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
