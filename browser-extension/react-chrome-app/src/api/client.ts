import axios from "axios";
import { Producer } from "../types";

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

const getUser = () => api.get<{ email: string }>(`/users/me`);

const getProducer = () => api.get<Producer>(`/producers/me`);

// export const updateWeeklySpent = (data: string) =>
//   api.patch(`/user/update/weeklyspent`, data);
// export const updateMonthlySpent = (data: string) =>
//   api.patch(`/user/update/monthlyspent`, data);
// export const updateMonthlyLimit = (data: string) =>
//   api.patch(`/user/update/monthlylimit`, data);
// export const updateWeeklyLimit = (data: string) =>
//   api.patch(`/user/update/weeklylimit`, data);
// export const updateTotalProducts = (data: string) =>
//   api.patch(`/user/update/totalproducts`, data);
// export const updateWeeklyItemsNotPurchased = (data: string) =>
//   api.patch(`/user/update/weeklyitemsnotpurchased`, data);
// export const updateMonthlyItemsNotPurchased = (data: string) =>
//   api.patch(`/user/update/monthlyitemsnotpurchased`, data);
// export const updateMonthlySaved = (data: string) =>
//   api.patch(`/user/update/monthlySaved`, data);
// export const updateWeeklySaved = (data: string) =>
//   api.patch(`/user/update/weeklySaved`, data);
// export const updatePurchases = (data: string) =>
//   api.patch(`/user/update/purchases`, data);
// export const updateAvoidanceList = (data: string) =>
//   api.patch(`/user/update/avoidancelist`, data);
// export const deleteUser = () => api.delete(`/user/delete`);

const client = {
  register,
  logIn,
  logOut,
  getUser,
  getProducer,
  //   getUser,
  //   updateWeeklySpent,
  //   updateMonthlySpent,
  //   updateMonthlyLimit,
  //   updateWeeklyLimit,
  //   updateTotalProducts,
  //   updateWeeklyItemsNotPurchased,
  //   updateMonthlyItemsNotPurchased,
  //   updateWeeklySaved,
  //   updateMonthlySaved,
  //   updatePurchases,
  //   updateAvoidanceList,
  //   deleteUser,
};

export default client;
