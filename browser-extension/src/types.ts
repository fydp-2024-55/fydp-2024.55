export const AuthTokenKey = "AuthTokenKey";

export type AuthState = "authenticated" | "unauthenticated" | "unknown";

export type Screen =
  | "profile"
  | "permissions"
  | "wallet"
  | "sign-up"
  | "sign-in";

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
