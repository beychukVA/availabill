import React from "react";
import { LoginStepsEnum } from "../lib/LoginStepEnum";
import { LoginEmailConfirmationStep } from "./Steps/LoginEmailConfirmationStep";
import { LoginEmailStep } from "./Steps/LoginEmailStep";
import { IStepProps } from "./types/ILogin";

class LoginComponentsFactory {
  list = {
    [LoginStepsEnum.LOGIN_EMAIL]: LoginEmailStep,
    [LoginStepsEnum.LOGIN_EMAIL_CONFIRMATION]: LoginEmailConfirmationStep,
  };

  getComponent({
    step,
    setStep,
    data,
    setData,
    handleChangeMenu,
    menu,
  }: IStepProps) {
    const Component = this.list[step];

    if (Component) {
      return (
        <Component
          {...{
            step,
            setStep,
            data,
            setData,
            handleChangeMenu,
            menu,
          }}
        />
      );
    }

    return null;
  }
}

export const loginComponentsFactory = new LoginComponentsFactory();
