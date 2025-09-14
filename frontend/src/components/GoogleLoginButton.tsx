import type { ApiAxiosError, ApiResponse } from "@/types";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "./ui/button";

import { FaGoogle } from "react-icons/fa";
import { useAuthStore } from "@/store";
import { api } from "@/lib/axios";
import { fetchUser } from "@/services/user.service";

const GoogleLoginButton = ({ isPending }: { isPending: boolean }) => {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const mutation = useMutation<
    ApiResponse<null>,
    ApiAxiosError,
    { code: string }
  >({
    mutationFn: async (payload) => {
      const response = api.post("/auth/google", payload);
      return (await response).data;
    },
  });

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (response) => {
      mutation.mutate(
        { code: response.code },
        {
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
        }
      );
    },
    onError: () => {
      toast.error("Failed to sign in using Google");
    },
  });
  return (
    <Button
      variant={"secondary"}
      className="w-full cursor-pointer"
      onClick={() => googleLogin()}
      disabled={isPending}
    >
      <FaGoogle />
      Continue with Google
    </Button>
  );
};

export default GoogleLoginButton;
