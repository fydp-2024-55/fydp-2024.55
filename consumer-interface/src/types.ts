export const AuthTokenKey = "AuthTokenKey";

export enum Page {
  Subscriptions = "Subscriptions",
  Purchase = "Purchase",
  Profile = "Profile",
  Wallet = "Wallet",
  SignUp = "Sign Up",
  SignIn = "Sign In",
}

export interface BearerToken {
  accessToken: string;
  tokenType: string;
}

export interface User {
  id?: string;
  email?: string;
  ethAddress?: string;
}

export interface Producer extends User {
  gender?: string;
  ethnicity?: string;
  dateOfBirth?: string;
  country?: string;
  income?: number;
  maritalStatus?: string;
  parentalStatus?: string;
}

export interface ProducerFilterOptions {
  genders?: string[];
  ethnicities?: string[];
  countries?: string[];
  maritalStatuses?: string[];
  parentalStatuses?: string[];
}

export interface ProducerFilter extends ProducerFilterOptions {
  minAge?: number;
  maxAge?: number;
  minIncome?: number;
  maxIncome?: number;
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

export interface ProducerCounts {
  totalResults: number;
  gender: { [key: string]: number };
  ethnicities: { [key: string]: number };
  countries: { [key: string]: number };
  maritalStatuses: { [key: string]: number };
  parentalStatuses: { [key: string]: number };
  incomes: { [key: string]: number };
  ages: { [key: string]: number };
}
