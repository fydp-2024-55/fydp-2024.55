import axios from "axios";

import applyCaseMiddleware from "axios-case-converter";
import {
  AuthState,
  AuthTokenKey,
  BearerToken,
  History,
  Producer,
  Wallet,
} from "../types";
import storageService from "./storage-service";

const api = applyCaseMiddleware(
  axios.create({
    baseURL: "http://localhost:8000",
  })
);

const backendService = {
  handleError: (error: any, setAuthState: (authState: AuthState) => void) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        api.defaults.headers.common["Authorization"] = null;
        storageService.removeItem(AuthTokenKey);
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
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  register: async (email: string, password: string) => {
    await api.post(`/auth/register`, { email, password });
  },

  logIn: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append("grant_type", "password");
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post<BearerToken>(`/auth/jwt/login`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const token = response.data.accessToken;

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    storageService.setItem(AuthTokenKey, token);

    return response.data;
  },

  logOut: async () => {
    await api.post(`/auth/jwt/logout`);

    api.defaults.headers.common["Authorization"] = null;
    storageService.removeItem(AuthTokenKey);
  },

  createProducer: async (data: Producer) => {
    const response = await api.post<Producer>(`/producer/me`, data);
    return response.data;
  },

  getProducer: async () => {
    const response = await api.get<Producer>(`/producer/me`);
    return response.data;
  },

  updateProducer: async (data: Partial<Producer>) => {
    const response = await api.patch<Producer>(`/producer/me`, data);
    return response.data;
  },

  createProducerHistory: async (data: History[]) => {
    const response = await api.post<History[]>(`/producer/me/histories/`, data);
    return response.data;
  },

  getProducerHistory: async () => {
    const response = await api.get<History[]>(`/producer/me/histories/`);
    return response.data;
  },

  getWallet: async () => {
    const response = await api.get<Wallet>(`users/me/wallet`);
    return response.data;
  },

  createWallet: async () => {
    const response = await api.post<Wallet>(`users/me/wallet`);
    return response.data;
  },

  updateWallet: async (ethAddress: string, privateKey: string) => {
    const response = await api.patch<Wallet>(`/users/me/wallet`, {
      ethAddress,
      privateKey,
    });
    return response.data;
  },
};

export default backendService;
