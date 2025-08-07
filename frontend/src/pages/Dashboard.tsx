import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  LogOut,
  Monitor,
  Smartphone,
  UserCog,
  Loader2,
  Tablet,
  Calendar,
  Shield,
  MapPin,
  Trash2,
} from "lucide-react";
import { useAppSelector } from "@/hooks";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  useFetchUserSessionsQuery,
  useLogoutAllMutation,
  useLogoutMutation,
  useLogoutSpecificSessionMutation,
} from "@/redux/api/apiSlice";
import { toast } from "react-toastify";
import { useState } from "react";

const Dashboard = () => {
  const [sessions] = useState([
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, US",
      ip: "192.168.1.1",
      lastActive: "2 minutes ago",
      current: true,
      icon: Monitor,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "New York, US",
      ip: "192.168.1.2",
      lastActive: "1 hour ago",
      current: false,
      icon: Smartphone,
    },
    {
      id: "3",
      device: "Chrome on iPad",
      location: "Boston, US",
      ip: "192.168.1.3",
      lastActive: "1 day ago",
      current: false,
      icon: Tablet,
    },
  ]);
  const userProfile = useAppSelector((state) => state.auth.user);

  const { data: sessionData, isLoading, refetch } = useFetchUserSessionsQuery();

  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const [logoutAll, { isLoading: logoutAllLoading }] = useLogoutAllMutation();
  const [logoutSpecificSession] = useLogoutSpecificSessionMutation();

  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const response = await logout().unwrap();
      toast.success(response.message || "Logged out successfully.");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.data?.message || "Error while logging out. Please try again."
      );
    }
  };

  const logoutAllHandler = async () => {
    try {
      const response = await logoutAll().unwrap();
      toast.success(response.message || "Logged out successfully.");
      refetch();
    } catch (error: any) {
      toast.error(
        error.data?.message || "Error while logging out. Please try again."
      );
    }
  };

  const logoutSpecificSessionHandler = async (id: string) => {
    try {
      const response = await logoutSpecificSession({ id }).unwrap();
      toast.success(response.message || "Logged out successfully.");
      refetch();
    } catch (error: any) {
      toast.error(
        error.data?.message || "Error while logging out. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Dashboard</h1>
            <p className="text-zinc-400">Manage your account and sessions</p>
          </div>
          <div className="flex gap-6 text-zinc-900">
            {userProfile?.role === "admin" && (
              <Button
                className="cursor-pointer"
                onClick={() => navigate("/admin")}
              >
                <UserCog className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Button>
            )}
            <Button
              className="cursor-pointer"
              disabled={logoutLoading}
              onClick={logoutHandler}
            >
              {logoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logout...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-zinc-900 border-white/10 text-zinc-50">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={userProfile?.avatar!}
                      alt={`${userProfile?.fullname}`}
                    />
                  </Avatar>

                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Full Name
                        </label>
                        <p className="text-lg font-medium">
                          {userProfile?.fullname}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Account Role
                        </label>
                        <div className="mt-1">
                          <Badge variant="secondary">{userProfile?.role}</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Email Address
                      </label>
                      <p className="text-lg">{userProfile?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Account ID
                      </label>
                      <p className="text-lg font-mono">{userProfile?.id}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage your active sessions across different devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-8 w-[80px]" />
                      </div>
                    ))}
                  </div>
                ) : sessionData ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Device</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessionData.data &&
                          sessionData.data.map((session) => {
                            const Icon = session.device.includes("Mobile")
                              ? Smartphone
                              : Monitor;
                            return (
                              <TableRow key={session.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                      {session.device}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span>{session.location}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                  {session.ip}
                                </TableCell>
                                <TableCell>{session.lastActive}</TableCell>
                                <TableCell>
                                  {session.current ? (
                                    <Badge variant="default">Current</Badge>
                                  ) : (
                                    <Badge variant="secondary">Active</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {!session.current && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive hover:text-destructive"
                                      onClick={() =>
                                        logoutSpecificSessionHandler(session.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                    <div className="mt-4">
                      <Button
                        variant="destructive"
                        className="gap-2"
                        disabled={logoutAllLoading}
                        onClick={logoutAllHandler}
                      >
                        {logoutAllLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Terminating...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Terminate All Other Sessions
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
