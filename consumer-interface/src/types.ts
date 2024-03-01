export enum Page {
  Subscriptions = "Subscriptions",
  Purchase = "Purchase",
  Profile = "Profile",
}

export const AuthTokenKey = "AuthTokenKey";

export type AuthState = "authenticated" | "unauthenticated" | "unknown";

export type Screen =
  | "profile"
  | "permissions"
  | "wallet"
  | "sign-up"
  | "sign-in";

export interface BearerToken {
  accessToken: string;
  tokenType: string;
}

interface User {
  email?: string;
  ethAddress?: string;
}

export interface Producer extends User {
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

export interface Interest {
  category: string;
  timeSpent: number;
}

export interface Consumer extends User {}

export interface Subscription extends Producer {
  interests: Interest[];
}

export const GENDERS = ["Male", "Female", "Other"];

export const ETHNICITIES = [
  "American Indian or Alaskan Native",
  "Asian/Pacific Islander",
  "Black or African American",
  "Hispanic",
  "White/Caucasian",
  "Other",
];

export const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];

export const PARENTAL_STATUSES = ["Parent", "Not Parent"];
