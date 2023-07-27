export enum Page {
  Profile = "Profile",
  Permissions = "Permissions",
  Wallet = "Wallet",
  History = "History",
  Subscribers = "Subscribers",
}

export interface Producer {
  // email: string;
  eth_address: string;
  name: string;
  gender: string;
  ethnicity: string;
  date_of_birth: string;
  country: string;
  income: number;
  marital_status: string;
  parental_status: string;
}

export interface Wallet {
  // eth_address: string;
  balance: number;
}

export interface Permissions {
  [key: string]: boolean;
}

export interface History {
  url: string;
  title: string;
  visit_time: string;
  time_spent: number;
}

export interface Subscriber {
  name: string;
  eth_address: string;
  email: string;
}
