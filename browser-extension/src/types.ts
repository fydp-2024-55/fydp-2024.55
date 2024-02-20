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
  name: string;
  gender: string | null;
  ethnicity: string | null;
  dateOfBirth: string | null;
  country: string | null;
  income: number | null;
  maritalStatus: string | null;
  parentalStatus: string | null;
}

export interface Wallet {
  ethAddress: string;
  balance: number;
}

export interface Permissions {
  [key: string]: boolean;
}

export interface History {
  url: string;
  title: string;
  visitTime: string;
  timeSpent: string;
}

export interface Subscriber {
  name: string;
  ethAddress: string;
  email: string;
}

export interface BearerToken {
  accessToken: string;
  tokenType: string;
}
