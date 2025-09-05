import { useEffect } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store";

export const fetchUser = async () => {
  const res = await api.get("/auth/me");
  return res.data.data;
};

const useUser = () => {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchUser();
        setUser(user);
      } catch (err) {}
    };

    loadUser();
  }, [setUser]);
};

export default useUser;
