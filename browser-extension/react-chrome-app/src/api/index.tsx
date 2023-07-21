import axios, { AxiosInstance } from "axios";
import url from "./Url";

const api: AxiosInstance = axios.create({
  baseURL: url,
});

export const createUser = (data: { email: string; password: string }) =>
  api.post(`/auth/register`, data);
// export const getUser = () => api.get(`/user/get`);
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

const apis = {
  createUser,
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

export default apis;
