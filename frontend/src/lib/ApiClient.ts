import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          (error.response.data as { message?: string })?.message ===
            "TokenExpiredError"
        ) {
          try {
            await this.api.post("/auth/refresh");
            return this.api(originalRequest!);
          } catch (error: any) {
            console.log("error while refreshing: ", error.message);
            window.location.href = "/login";
          }

          return Promise.reject(error);
        }
      }
    );
  }

  //   API requests
  public async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const res = await this.api.post("/auth/register", data);
    return res.data;
  }

  public async login(data: { email: string; password: string }) {
    const res = await this.api.post("/auth/login", data);
    return res.data;
  }

  public async verifyEmail(token: string) {
    const res = await this.api.post(`/auth/email/verify/${token}`);
    return res.data;
  }
}

const apiClient = new ApiClient();

export default apiClient;
