export enum Page {
  Profile = "Profile",
  Permissions = "Permissions",
  Wallet = "Wallet",
  History = "History",
  Subscribers = "Subscribers",
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
  eth_address: string;
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
