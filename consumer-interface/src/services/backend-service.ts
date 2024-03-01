import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

import {
  AuthTokenKey,
  BearerToken,
  Wallet,
  Consumer,
  Producer,
  ProducerFilterOptions,
  ProducerFilter,
} from "../types";

const apiClient = applyCaseMiddleware(
  axios.create({
    baseURL: "http://localhost:8000",
  })
);

const backendService = {
  handleError: (
    error: any,
    setIsAuthenticated: (isAuthenticated: boolean) => void
  ) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        apiClient.defaults.headers.common["Authorization"] = null;
        localStorage.removeItem(AuthTokenKey);
        setIsAuthenticated(false);
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

  createConsumer: async () => {
    const response = await apiClient.post<Consumer>(`/consumers/me`);
    return response.data;
  },

  getConsumer: async () => {
    const response = await apiClient.get<Consumer>(`/consumers/me`);
    return response.data;
  },

  deleteConsumer: async () => {
    await apiClient.delete(`/consumers/me`);
  },

  // getSubscriptions: async () => {
  //   const response = await apiClient.get<Producer[]>(
  //     `/consumers/me/subscriptions`
  //   );
  //   return response.data;
  // },

  // createSubscriptions: async () => {
  //   const response = await apiClient.post<Producer[]>(
  //     `/consumers/me/subscriptions`
  //   );
  //   return response.data;
  // },

  // deleteSubscriptions: async () => {
  //   await apiClient.delete(`/consumers/me/subscriptions`);
  // },

  getProducerFilterOptions: async () => {
    const response = await apiClient.get<ProducerFilterOptions>(
      `/producers/filter-options`
    );
    return response.data;
  },

  getProducers: async (params: ProducerFilter) => {
    const response = await apiClient.get<Producer[]>(`/producers`, { params });
    return response.data;
  },
};

export default backendService;
