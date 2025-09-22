import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ApiAxiosError, ApiResponse, User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUserSessionsById } from "@/services/admin.service";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export function ManageSessionsDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  user: User | null;
}) {
  if (!user) return null;

  const {
    data: sessions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-sessions", user.id],
    queryFn: () => fetchUserSessionsById(user.id),
    enabled: !!user, // run only if user exists
  });

  const { mutate: logout, isPending } = useMutation<
    ApiResponse<null>,
    ApiAxiosError,
    { id: string }
  >({
    mutationFn: async ({ id }) => {
      const res = await api.delete(`/admin/users/sessions/${id}`);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message);
      refetch();
    },
    onError: () => {
      toast.error("Error while logging out, Please try again.");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Sessions</DialogTitle>
          <DialogDescription>
            Active sessions for {user?.name}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading sessions...</p>
        )}

        {error && (
          <p className="text-sm text-red-500">Error while fetching sessions</p>
        )}

        {!isLoading && sessions?.length === 0 && (
          <p className="text-sm text-muted-foreground">No active sessions</p>
        )}

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {sessions?.map((session) => (
            <div
              key={session.id}
              className="flex justify-between items-center text-sm pb-2"
            >
              <div>
                <div>{session.device}</div>
                <div className="text-muted-foreground">
                  {session.ip} ({session.location})
                </div>
                <div className="text-xs">{session.lastLogin}</div>
              </div>
              <div>
                {session.current ? (
                  <span className="text-xs rounded bg-muted px-2 py-0.5">
                    This device
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-6 text-xs"
                    onClick={() => logout({ id: session.id })}
                    disabled={isPending}
                  >
                    Logout
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
