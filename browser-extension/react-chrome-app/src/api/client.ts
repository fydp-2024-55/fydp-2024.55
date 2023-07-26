import axios from "axios";
import { Producer, History } from "../types";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

const register = async (data: { email: string; password: string }) =>
  api.post(`/auth/register`, data);

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
  const response = await api.post(`/auth/jwt/logout`);
  delete api.defaults.headers.common["Authorization"];
  return response;
};


const getProducer = async () => {
  const response = await api.get<Producer>(`/producer/me`)
  return response.data
}


// TODO: HELP
const updateProducer = async () => {
  // const response = await api.patch(`producer/me`)
  console.log('called')
  // return response
}

const getHistory = async () => {
  const response = await api.get<History[]>(`/histories/`)
  const histories: History[] = response.data
  return histories
}

const getUser = () => api.get<{ email: string }>(`/users/me`);

const client = {
  register,
  logIn,
  logOut,
  getUser,
  getProducer,
  updateProducer,
  getHistory,
};

export default client;
