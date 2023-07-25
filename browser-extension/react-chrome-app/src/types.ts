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
  dateOfBirth: string;
  city: string;
  state: string;
  country: string;
  income: number;
  maritalStatus: string;
  parentalStatus: string;
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
  subscribedSince: string;
}
