import axios from "axios";

import { Producer, History } from "../types";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

const register = async (data: {
  email: string;
  password: string;
  eth_address: string;
}) => api.post(`/auth/register`, data);

const logIn = async (data: { email: string; password: string }) => {
  const formData = new FormData();
  formData.append("username", data.email);
  formData.append("password", data.password);
  const response = await api.post<{
    access_token: string;
    token_type: string;
  }>(`/auth/jwt/login`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  api.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${response.data.access_token}`;
  return response;
};

const logOut = async () => {
  await api.post(`/auth/jwt/logout`);
  // delete api.defaults.headers.common["Authorization"];
};

const getProducer = async () => {
  const response = await api.get<Producer>(`/producer/me`);
  return response.data;
};

const updateProducer = async (data: Producer) => {
  const response = await api.patch(`producer/me`, data);
  console.log(response);
};

const getHistory = async () => {
  const response = await api.get<History[]>(`/histories/`);
  const histories: History[] = response.data;
  return histories;
};

const getUser = () => api.get<{ email: string }>(`/users/me`);

const createWallet = () => api.post(`/wallet/`);

const updateWallet = () =>
  api.patch<{ ethAddress?: string; privateKey: string }>(`/wallet/`);

const client = {
  register,
  logIn,
  logOut,
  getUser,
  getProducer,
  updateProducer,
  getHistory,
  createWallet,
  updateWallet,
};

export default client;
