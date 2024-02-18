export enum Page {
  Subscriptions = "Subscriptions",
  Purchase = "Purchase",
  Profile = "Profile",
}

export interface Producer {
  name: string;
  email: string;
  gender: string;
  ethnicity: string;
  dateOfBirth: string;
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

export interface Consumer {
  name: string;
  email: string;
  ethAddress: string;
}

export interface Subscription extends Producer {
  history: History[];
}

export enum Gender {
  M = "Male",
  F = "Female",
}

export enum Ethnicity {
  N = "American Indian or Alaskan Native",
  A = "Asian/Pacific Islander",
  B = "Black or African American",
  H = "Hispanic",
  W = "White/Caucasian",
  O = "Other",
}

export enum MaritalStatus {
  M = "Married",
  S = "Single",
  D = "Divorced",
  W = "Widowed",
}

export enum ParentalStatus {
  Y = "Parent",
  N = "Not a Parent",
}
