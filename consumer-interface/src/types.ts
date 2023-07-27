export enum Page {
  Subscriptions = "Subscriptions",
  Purchase = "Purchase",
  Profile = "Profile",
}

export interface Producer {
  name: string;
  gender: string;
  ethnicity: string;
  date_of_birth: string;
  city: string;
  state: string;
  country: string;
  income: number;
  marital_status: string;
  parental_status: string;
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

export interface Consumer {
  name: string;
  email: string;
  ethAddress: string;
}
