import api from "@/lib/axios";
import type { ApiAxiosError, ApiResponse } from "@/types";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa";

const GoogleLoginButton = ({ isPending }: { isPending: boolean }) => {
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
      console.log("response from google,", response);
      mutation.mutate(
        { code: response.code },
        {
          onSuccess: (res) => {
            toast.success(res.message);
            navigate({ to: "/dashboard" });
          },
          onError: (error) => {
            toast.error(error.response?.data.message);
          },
        }
      );
    },
    onError: (error) => {
      console.log("error from google: ", error);
      toast.error("Failed to sign in using Google");
    },
  });
  return (
    <Button
      variant={"outline"}
      className="w-full border cursor-pointer"
      onClick={() => googleLogin()}
    >
      <FaGoogle />
      Continue with Google
    </Button>
  );
};

export default GoogleLoginButton;
