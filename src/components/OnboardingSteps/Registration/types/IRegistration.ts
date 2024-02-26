import { IOnboardingMenu } from "@/components/OnboardingMenu/IOnboardingMenu";
import { IGender } from "@/redux/User/Profile/types/IProfile";
import { IGenders } from "./IGender";

export interface IDate {
  email: string;
  emailCode: string;
  onboardingCode: string;
  mobile: string;
  mobileConfirmCode: string;
  password: string;
  passwordConfirm: string;
  gender: string;
  firstName: string;
  lastName: string;
  birthday: string;
}

export interface IStepProps {
  handleChangeMenu: (itemMenu: string) => void;
  menu: IOnboardingMenu;
  step: string;
  setStep: (step: string) => void;
  data: IDate;
  setData: (data: React.SetStateAction<IDate>) => void;
}

export interface IRegister {
  email: string;
  language: string;
}

export interface IRegisterCode {
  code: string;
}

export interface IOnboardingResponse {
  message: string;
  code: string;
  url: string;
}

export interface IRegisterPhoneCode {
  code: string;
  phoneNumber?: string | null;
}

export interface IRegisterConfirmPhoneCode {
  code: string;
}

export interface IRegisterPasswordCode {
  code: string;
  password: string;
}

export interface INewPassword {
  code: string;
  password: string;
}

export interface IRegisterDataCode {
  code: string;
  gender: IGender;
  name: string;
  firstName: string;
  birthDate: string;
}

export interface IOneTimePassword {
  reference: string;
  passwordType:
    | "LOGIN"
    | "REGISTRATION"
    | "ONBOARDING"
    | "ONBOARDING_PHONE_NUMBER"
    | "ONBOARDING_DATA"
    | "PASSWORD_RESET"
    | "EMAIL_CONFIRMATION"
    | "PHONE_NUMBER_CONFIRMATION"
    | "LINK_KAR_ACCOUNT"
    | "LINK_CARDS_ACCOUNT"
    | "CHANGE_EMAIL_CONFIRMATION"
    | "CHANGE_PHONE_NUMBER_CONFIRMATION";
}

export interface IRegisterResponse {
  id: number;
  email: string;
  phoneNumber: string | null;
  gender: string | null;
  name: string | null;
  firstName: string | null;
  birthDate: string | null;
  address: string | null;
  roles: [
    {
      id: number;
      name: string;
    }
  ];
}

export interface ISetDataResponse {
  id: number;
  email: string;
  phoneNumber: string;
  gender: string;
  name: string;
  firstName: string;
  birthDate: string;
  address: {
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
  };
  language: string;
  roles: [
    {
      id: number;
      name: string;
    }
  ];
}
