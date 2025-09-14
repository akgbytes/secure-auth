import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/lib/axios";
import { sessionsQueryOptions } from "@/lib/queryOptions";
import type { ApiAxiosError, ApiResponse } from "@/types";
import { getDeviceIcon } from "@/utils/getDeviceIcon";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Laptop, MapPin, Monitor, Smartphone, Wifi } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_protectedRoutes/dashboard/sessions/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(sessionsQueryOptions),
  component: RouteComponent,
});

function RouteComponent() {
  const sessionsData = useSuspenseQuery(sessionsQueryOptions);
  const sessions = sessionsData.data;

  const { mutate: logout } = useMutation<
    ApiResponse<null>,
    ApiAxiosError,
    { id: string }
  >({
    mutationFn: async ({ id }) => {
      const res = await api.delete(`/sessions/${id}`);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: () => {
      toast.error("Error while logging out, Please try again.");
    },
  });
  const handleLogout = (sessionId: string) => {};

  const currentSession = sessions.find((session) => session.current);
  const otherSessions = sessions.filter((session) => !session.current);

  return (
    <div className="pl-8 max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Sessions</h1>
        <p className="text-zinc-300 text-balance">
          Sessions are the devices you are using or have used your account on.
          You can log out of each session individually.
        </p>
      </div>

      {/* Current Active Session */}
      {currentSession && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Current active session
            </h2>
            <p className="text-zinc-300">
              {
                "You're logged into this account on this device and are currently using it."
              }
            </p>
          </div>

          <Card className="border-border bg-transparent p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getDeviceIcon(currentSession.device)}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-card-foreground">
                      {currentSession.device}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-500 border-green-500/20"
                    >
                      Active now
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {currentSession.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      {currentSession.ip}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {currentSession.lastActive}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Other Sessions */}
      {otherSessions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Other sessions
          </h2>

          <div className="space-y-3">
            {otherSessions.map((session) => (
              <Card
                key={session.id}
                className="border-border bg-transparent p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getDeviceIcon(session.device)}
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
                    onClick={() => logout({ id: session.id })}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Logout
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {otherSessions.length === 0 && !currentSession && (
        <Card className="border-border bg-card p-12 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-card-foreground">
              No sessions found
            </h3>
            <p className="text-muted-foreground">
              You don't have any active sessions at the moment.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

/**
 * 
 * @returns  <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getDeviceIcon(currentSession.device)}
                  <div>
                    <h5 className="font-medium text-foreground">
                      {currentSession.device}
                    </h5>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {currentSession.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        {currentSession.ip}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {currentSession.lastActive}
                      </div>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-500 hover:bg-green-600"
                >
                  Active now
                </Badge>
              </div>
            </CardContent>
          </Card>
 */
