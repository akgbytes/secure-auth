import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Monitor } from "lucide-react";

export const Route = createFileRoute("/_protectedRoutes/dashboard/sessions/")({
  component: RouteComponent,
});

type Session = {
  id: string;
  device: string;
  browser: string;
  isActive: boolean;
};

const sessions: Session[] = [
  {
    id: "1",
    device: "Windows 10",
    browser: "Chrome",
    isActive: true,
  },
  {
    id: "2",
    device: "Macbook Pro",
    browser: "Safari",
    isActive: false,
  },
  {
    id: "3",
    device: "Pixel 7",
    browser: "Mobile Chrome",
    isActive: false,
  },
];

function RouteComponent() {
  return (
    <div className="max-w-2xl px-4 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Sessions</h2>
        <p className="text-sm text-zinc-300">
          Sessions are the devices you are using or have used your SecureAuth
          account on. You can log out of each session individually.
        </p>
      </div>

      {/* Current active session */}
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle>Current active session</CardTitle>
          <p className="text-sm text-zinc-300">
            You&apos;re logged into this SecureAuth account on this device and
            are currently using it.
          </p>
        </CardHeader>
        <CardContent>
          {sessions
            .filter((s) => s.isActive)
            .map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Monitor className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {session.device} / {session.browser}
                    </p>
                    <Badge
                      variant="default"
                      className="bg-green-600 text-zinc-200"
                    >
                      Active now
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Other sessions */}
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle>Other sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions
            .filter((s) => !s.isActive)
            .map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Monitor className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {session.device} / {session.browser}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log("Logout", session.id)}
                >
                  Logout
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
