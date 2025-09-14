import { queryOptions } from "@tanstack/react-query";
import { fetchSessions, fetchUsers, fetchUserSessionById } from "./axios";

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
    queryKey: ["users", { userId }],
    queryFn: () => fetchUserSessionById(userId),
  });
