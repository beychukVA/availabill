import { IOnboardingMenu } from "@/components/OnboardingMenu/IOnboardingMenu";

export interface IDate {
  email: string;
  emailCode: string;
  password: string;
  token: string;
  resendEmail: string;
}

export interface IStepProps {
  handleChangeMenu: (itemMenu: string) => void;
  menu: IOnboardingMenu;
  step: string;
  setStep: (step: string) => void;
  data: IDate;
  setData: (data: React.SetStateAction<IDate>) => void;
}

export interface ILogin {
  username: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_at: string;
}

export interface IConfirmLogin {
  access_token: string;
  code: string;
}

export interface IForgotLoginPassword {
  email: string;
}

export interface ICurrentUser {
  id: number;
  email: string;
  phoneNumber: string;
  gender: string;
  name: string;
  firstName: string;
  birthDate: string;
  language: string;
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
  roles: [
    {
      id: number;
      name: string;
    }
  ];
}
