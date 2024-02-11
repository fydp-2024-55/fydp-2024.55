export const AuthTokenKey = "AuthTokenKey";

export enum AuthState {
  Authenticated = "Authenticated",
  Unauthenticated = "Unauthenticated",
  Unknown = "Unknown",
}

export enum Page {
  Profile = "Profile",
  Permissions = "Permissions",
  Wallet = "Wallet",
  History = "History",
  Subscribers = "Subscribers",
  Registration = "Registration",
  Login = "Login",
}

export interface Producer {
  eth_address: string;
  name: string;
  gender: string | null;
  ethnicity: string | null;
  date_of_birth: string | null;
  country: string | null;
  income: number | null;
  marital_status: string | null;
  parental_status: string | null;
}

export interface Wallet {
  eth_address: string;
  balance: number;
}

export interface Permissions {
  [key: string]: boolean;
}

export interface History {
  url: string;
  title: string;
  visit_time: string;
  time_spent: string;
}

export interface Subscriber {
  name: string;
  ethAddress: string;
  email: string;
}

export interface BearerToken {
  access_token: string;
  token_type: string;
}
