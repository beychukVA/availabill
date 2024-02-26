import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";

export interface IChangeNameResponse {
  id: number;
  user: {
    id: number;
    email: string;
    salutation: string;
    name: string;
    firstName: string;
  };
  account: {
    id: number;
    name: string;
    email: string;
    account_type: string;
  };
  request_type: string;
  fulfillment_status: string;
  updated_at: string;
}

export interface IChangePasswordResponse {
  id: number;
  email: string;
  phoneNumber: string;
  gender: IGender;
  name: string;
  firstName: string;
  birthDate: string;
  address: {
    id: number;
    type: AdressType;
    country: string;
    city: string;
    zipCode: string;
    street: string;
    streetExtension: string;
    houseNumber: string;
    addon: string;
    regionCode: string;
  };
  language: string;
  roles: [
    {
      id: number;
      name: string;
    }
  ];
}

export type IGender = "M" | "F";
export type AdressType = "MAIN";

export interface IChangeName {
  userId: number | undefined;
  gender: IGender | undefined;
  name: string | undefined;
  firstName: string | undefined;
  birthDate?: string | undefined;
  language?: string | undefined;
}

export interface IChangePrimaryEmail {
  userId: number | undefined;
  email: string | undefined;
}

export interface IConfirmPrimaryEmail {
  userId: number | undefined;
  code: string | undefined;
}

export interface IChangePaswword {
  userId: number | undefined;
  oldPassword: string | undefined;
  newPassword: string | undefined;
}

export interface IAdditionalEmail {
  email: string;
}
export interface IAdditionalEmailConfirmation {
  code: string;
}

export interface IConfirmationEmailResponse {
  message: string;
}

export interface IAdditionalEmailsResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: [
    {
      id: number;
      email: string;
      confirmed: boolean;
      user: ICurrentUser;
    }
  ];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface IAdditionalEmails {
  userId: number;
  page?: number;
  size?: number;
}

export interface IDeleteAdditionEmail {
  userId: number;
  email: string;
  password?: string;
  type: "KAR" | "CARDS";
}

export interface IChangePhoneNumber {
  userId: number;
  phoneNumber: string;
}

export interface IConfirmChangePhoneNumber {
  userId: number;
  code: string;
}

export interface IAddressResponse {
  id: number;
  type: string;
  country: string;
  city: string;
  zipCode: string;
  street: string;
  streetExtension: string;
  houseNumber: string;
  addon: string;
  regionCode: string;
}

export interface IAddress {
  userId: number;
  country: string;
  city: string;
  zipCode: string;
  street: string;
  streetExtension?: string;
  houseNumber?: string;
  addon?: string;
  regionCode?: string;
}

export interface IDeletePhoneNumber {
  userId: number;
  password: string;
}

export interface IDeactivationAccount {
  userId: number;
}

export interface IDeleteAccount {
  userId: number;
  code: string;
}
