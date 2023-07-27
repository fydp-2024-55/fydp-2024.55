import axios from "axios";
import { Producer, History, Wallet, Subscriber } from "../types";

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
  const response = await api.get<Producer>(`/producers/me`);
  return response.data;
};

const createProducer = async (data: Producer) => {
  await api.post(`/producers/`, data);
  console.log(data);
};

const updateProducer = async (data: Producer) => {
  const response = await api.patch(`/producers/me`, data);
  console.log(response);
};

const getHistory = async () => {
  const response = await api.get<History[]>(`/producers/me/histories/`);
  const histories: History[] = [
    {
      url: "https://facebook.com",
      title: "Facebook",
      visit_time: "2023-07-20 04:30",
      time_spent: 50000,
    },
    {
      url: "https://khanacademy.org",
      title: "Khan Academy",
      visit_time: "2023-06-30 12:40",
      time_spent: 5000,
    },
  ];
  return histories;
};

const getWallet = async () => {
  const response = await api.get<Wallet>(`/producers/me/wallet/`);
  return response.data;
};

const getSubscribers = async () => {
  const response = await api.get<{ subscriptions: Subscriber[] }>(
    `/producers/me/subscriptions`
  );
  return response.data.subscriptions;
};

const getUser = () => api.get<{ email: string }>(`/users/me`);

const client = {
  register,
  logIn,
  logOut,
  getUser,
  createProducer,
  getProducer,
  updateProducer,
  getHistory,
  getWallet,
  getSubscribers,
};

export default client;
