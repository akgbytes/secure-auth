import { useEffect } from "react";
import api from "@/lib/axios";

export const fetchUser = async () => {
  const res = await api.get("/auth/me");
  return res.data.data;
};
