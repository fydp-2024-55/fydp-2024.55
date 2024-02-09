import axios from "axios";

import { BearerToken, History, Producer, Wallet } from "../types";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

const displayError = (error: any) => {
  if (axios.isAxiosError(error)) {
    alert(`[${error.status}] ${error.name}: ${error.message}`);
  } else if (error instanceof Error) {
    alert(`${error.name}: ${error.message}`);
  }
};

const register = async (
  email: string,
  password: string,
  eth_address: string
) => {
  await api.post(`/auth/register`, { email, password, eth_address });
};

const logIn = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append("grant_type", "password");
  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post<BearerToken>(`/auth/jwt/login`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  api.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${response.data.access_token}`;

  return response.data;
};

const logOut = () => {
  api.post(`/auth/jwt/logout`);
  api.defaults.headers.common["Authorization"] = null;
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

const createWallet = async () => {
  const response = await api.post<Wallet>(`/wallet/`);
  const wallet: Wallet = response.data;
  return wallet;
};

const updateWallet = async (data: Wallet) => {
  const response = await api.patch(`/users/me/wallet/`, data); // TODO: Set explicit type response
  const user = response.data;
  return user;
};

const client = {
  displayError,
  register,
  logIn,
  logOut,
  createProducer,
  getProducer,
  updateProducer,
  createWallet,
  updateWallet,
  createProducerHistory,
  getProducerHistory,
};

export default client;
