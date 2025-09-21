import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Session = {
  id: string;
  device: string;
  ip: string;
  location: string;
  lastLogin: string;
  current?: boolean;
};

type User = {
  id: string;
  name: string;
  email: string;
};

export function ManageSessionsDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  user: User | null;
}) {
  // mock data
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "Chrome on Windows",
      ip: "192.168.1.20",
      location: "New Delhi, IN",
      lastLogin: "Sep 20, 2025 10:45 PM",
      current: true,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      ip: "10.20.30.40",
      location: "Mumbai, IN",
      lastLogin: "Sep 18, 2025 09:10 AM",
    },
    {
      id: "3",
      device: "Firefox on Linux",
      ip: "203.0.113.55",
      location: "Bangalore, IN",
      lastLogin: "Sep 15, 2025 07:25 PM",
    },
  ]);

  const handleLogout = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Sessions</DialogTitle>
          <DialogDescription>
            Active sessions for {user?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex justify-between items-center text-sm border-b pb-2"
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
                    onClick={() => handleLogout(session.id)}
                  >
                    Logout
                  </Button>
                )}
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <p className="text-muted-foreground text-sm">No active sessions</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
