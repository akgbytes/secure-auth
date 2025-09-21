import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import Spinner from "./Spinner";
import { useMutation } from "@tanstack/react-query";
import type { ApiAxiosError, ApiResponse } from "@/types";
import { api } from "@/lib/axios";
import { fetchUser } from "@/services/user.service";
import { toast } from "sonner";
import { useAuthStore } from "@/store";
import { useNavigate } from "@tanstack/react-router";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

const DeleteAccountDialog = ({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) => {
  const { clearUser } = useAuthStore();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation<ApiResponse<null>, ApiAxiosError>({
    mutationFn: async () => {
      const response = await api.delete("auth/account/delete");
      return response.data;
    },
    onSuccess: async (res) => {
      toast.success(res.message);
      clearUser();
      onOpenChange(false);
      navigate({ to: "/signin" });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-xl">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Your account will be permanently
            deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => {
              mutate();
            }}
            disabled={isPending}
          >
            {isPending ? <Spinner text="Deleting" /> : <span>Yes, delete</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
