import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UpdateProfileDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  currentImage?: string;
  name?: string;
}

export function UpdateProfileDialog({
  open,
  onOpenChange,
  currentImage,
  name = "User",
}: UpdateProfileDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = () => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    toast.success("Profile updated!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Update profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={preview || currentImage} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>

          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            Recommended size 1:1, up to 10MB.
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!file}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
