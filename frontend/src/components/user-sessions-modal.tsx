import { userSessionsQueryOptions } from "@/services/queryOptions";
import type { ApiAxiosError, ApiResponse, User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, MapPin, Wifi } from "lucide-react";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { getDeviceIcon } from "@/utils/getDeviceIcon";
import { Badge } from "./ui/badge";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export function UserSessionsModal({ user }: { user: User }) {
  const {
    data: sessions,
    isLoading,
    error,
  } = useQuery(userSessionsQueryOptions(user.id));

  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation<
    ApiResponse<null>,
    ApiAxiosError,
    { id: string }
  >({
    mutationFn: async ({ id }) => {
      const res = await api.delete(`/admin/users/session/${id}`);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({
        queryKey: ["user-sessions"],
      });
    },
    onError: () => {
      toast.error("Error while logging out, Please try again.");
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !sessions) {
    return <div>Error</div>;
  }

  if (sessions.length === 0) {
    return <div>No sessions found</div>;
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <Card key={session.id} className="border-border bg-transparent p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getDeviceIcon(session.device || "")}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-card-foreground">
                    {session.device}
                  </h3>
                  {session.status === "expired" && (
                    <Badge
                      variant="outline"
                      className="bg-red-500/10 text-red-500 border-red-500/20"
                    >
                      Expired
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {session.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    {session.ip}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {session.lastActive}
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout({ id: session.id });
              }}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Logout
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
