import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import type { ApiAxiosError, ApiResponse } from "@/types";
import { api } from "@/lib/axios";
import Spinner from "./Spinner";
import { fetchUser } from "@/services/user.service";
import { useAuthStore } from "@/store";

interface UpdateProfileDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  name?: string;
}

export function UpdateProfileDialog({
  open,
  onOpenChange,

  name = "User",
}: UpdateProfileDialogProps) {
  const { setUser } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { mutate, isPending } = useMutation<
    ApiResponse<null>,
    ApiAxiosError,
    File
  >({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.patch("/users/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });

  const handleSave = () => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    mutate(file, {
      onSuccess: async (res) => {
        const user = await fetchUser();
        setUser(user);
        toast.success(res.message);
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const objectUrl = URL.createObjectURL(selected);
      setFile(selected);
      setPreview(objectUrl);
    }
  };

  useEffect(() => {
    if (!open && preview) {
      // dialog closed → cleanup
      URL.revokeObjectURL(preview);
      setPreview(null);
      setFile(null);
    }
  }, [open, preview]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Update profile</DialogTitle>
          <DialogDescription>
            Recommended size 1:1, up to 5MB.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={preview || undefined} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>

          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!file || isPending}>
            {isPending ? <Spinner text="Saving" /> : <span>Save</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
