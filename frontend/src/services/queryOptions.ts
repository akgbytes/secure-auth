import { queryOptions } from "@tanstack/react-query";
import { fetchSessions } from "./session.service";
import { fetchUsers, fetchUserSessionsById } from "./admin.service";

export const sessionsQueryOptions = queryOptions({
  queryKey: ["sessions"],
  queryFn: () => fetchSessions(),
});

export const usersQueryOptions = queryOptions({
  queryKey: ["users"],
  queryFn: () => fetchUsers(),
});

export const userSessionsQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-sessions"],
    queryFn: () => fetchUserSessionsById(userId),
  });
