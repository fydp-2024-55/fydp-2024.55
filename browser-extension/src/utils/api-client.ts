import axios from "axios";

import {
  AuthState,
  AuthTokenKey,
  BearerToken,
  History,
  Producer,
  Wallet,
} from "../types";
import persistentStorage from "./persistent-storage";
import applyCaseMiddleware from "axios-case-converter";

const api = applyCaseMiddleware(
  axios.create({
    baseURL: "http://localhost:8000",
  })
);

const handleError = (
  error: any,
  setAuthState: (authState: AuthState) => void
) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      api.defaults.headers.common["Authorization"] = null;
      persistentStorage.removeItem(AuthTokenKey);
      setAuthState(AuthState.Unauthenticated);
    } else {
      alert(
        `${error.name} [${error.code}]: ${error.message}
        ${JSON.stringify(error.response?.data)}`
      );
    }
  } else if (error instanceof Error) {
    alert(`${error.name}: ${error.message}`);
  }
};

const register = async (email: string, password: string) => {
  await api.post(`/auth/register`, { email, password });
};

const logIn = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append("grant_type", "password");
  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post<BearerToken>(`/auth/jwt/login`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const token = response.data.accessToken;

  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  persistentStorage.setItem(AuthTokenKey, token);

  return response.data;
};

const logOut = async () => {
  await api.post(`/auth/jwt/logout`);

  api.defaults.headers.common["Authorization"] = null;
  persistentStorage.removeItem(AuthTokenKey);
};

const createProducer = async (data: Producer) => {
  const response = await api.post<Producer>(`/producer/me`, data);
  return response.data;
};

const getProducer = async () => {
  const response = await api.get<Producer>(`/producer/me`);
  return response.data;
};

const updateProducer = async (data: Partial<Producer>) => {
  const response = await api.patch<Producer>(`/producer/me`, data);
  return response.data;
};

const createProducerHistory = async (data: History[]) => {
  const response = await api.post<History[]>(`/producer/me/histories/`, data);
  return response.data;
};

const getProducerHistory = async () => {
  const response = await api.get<History[]>(`/producer/me/histories/`);
  return response.data;
};

const getWallet = async () => {
  const response = await api.get<Wallet>(`users/me/wallet`);
  return response.data;
};

const createWallet = async () => {
  const response = await api.post<Wallet>(`users/me/wallet`);
  return response.data;
};

const updateWallet = async (ethAddress: string, privateKey: string) => {
  const response = await api.patch<Wallet>(`/users/me/wallet`, {
    ethAddress,
    privateKey,
  });
  return response.data;
};

const client = {
  api,
  handleError,
  register,
  logIn,
  logOut,
  createProducer,
  getProducer,
  updateProducer,
  getWallet,
  createWallet,
  updateWallet,
  createProducerHistory,
  getProducerHistory,
};

export default client;
