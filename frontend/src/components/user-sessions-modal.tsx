import { userSessionsQueryOptions } from "@/lib/queryOptions";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Wifi } from "lucide-react";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { getDeviceIcon } from "@/utils/getDeviceIcon";

export function UserSessionsModal({ user }: { user: User }) {
  const {
    data: session,
    isLoading,
    error,
  } = useQuery(userSessionsQueryOptions(user.id));

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div>
      <div className="space-y-3">
        <Card key={session?.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getDeviceIcon(session?.device || "")}
                <div>
                  <h5 className="font-medium text-foreground">
                    {session?.device}
                  </h5>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session?.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      {session?.ip}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session?.lastActive}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
