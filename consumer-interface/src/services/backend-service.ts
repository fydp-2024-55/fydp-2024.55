import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

import {
  AuthState,
  AuthTokenKey,
  BearerToken,
  Producer,
  Wallet,
  Permissions,
} from "../types";

const apiClient = applyCaseMiddleware(
  axios.create({
    baseURL: "http://localhost:8000",
  })
);

const backendService = {
  handleError: (error: any, setAuthState: (authState: AuthState) => void) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        apiClient.defaults.headers.common["Authorization"] = null;
        localStorage.removeItem(AuthTokenKey);
        setAuthState("unauthenticated");
      } else {
        alert(
          `${error.name} [${error.code}]: ${error.message}
          ${JSON.stringify(error.response?.data)}`
        );
      }
    } else if (error instanceof Error) {
      alert(`${error.name}: ${error.message}`);
    }
  },

  setToken: (token: string) => {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  register: async (email: string, password: string) => {
    await apiClient.post(`/auth/register`, { email, password });
  },

  logIn: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append("grant_type", "password");
    formData.append("username", email);
    formData.append("password", password);

    const response = await apiClient.post<BearerToken>(
      `/auth/jwt/login`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    const token = response.data.accessToken;

    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem(AuthTokenKey, token);

    return response.data;
  },

  logOut: async () => {
    await apiClient.post(`/auth/jwt/logout`);

    apiClient.defaults.headers.common["Authorization"] = null;
    localStorage.removeItem(AuthTokenKey);
  },

  createProducer: async (data: Producer) => {
    const response = await apiClient.post<Producer>(`/producers/me`, data);
    return response.data;
  },

  getProducer: async () => {
    const response = await apiClient.get<Producer>(`/producers/me`);
    return response.data;
  },

  updateProducer: async (data: Partial<Producer>) => {
    const response = await apiClient.patch<Producer>(`/producers/me`, data);
    return response.data;
  },

  getWallet: async () => {
    const response = await apiClient.get<Wallet>(`users/me/wallet`);
    return response.data;
  },

  createWallet: async () => {
    const response = await apiClient.post<Wallet>(`users/me/wallet`);
    return response.data;
  },

  updateWallet: async (ethAddress: string, privateKey: string) => {
    const response = await apiClient.patch<Wallet>(`/users/me/wallet`, {
      ethAddress,
      privateKey,
    });
    return response.data;
  },

  getPermissions: async () => {
    const response = await apiClient.get<Permissions>(
      `/producers/me/permissions`
    );
    return response.data;
  },

  updatePermissions: async (permissions: Permissions) => {
    const response = await apiClient.patch<Permissions>(
      `/producers/me/permissions`,
      permissions
    );
    return response.data;
  },
};

export default backendService;
