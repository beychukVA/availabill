import React from "react";
import { RegistrationStepsEnum } from "../lib/RegistrationStepsEnum";
import { RegistrationEmailConfirmationStep } from "./Steps/RegistrationEmailConfirmationStep";
import { RegistrationEmailStep } from "./Steps/RegistrationEmailStep";
import { RegistrationMobileConfirmationStep } from "./Steps/RegistrationMobileConfirmationStep";
import { RegistrationMobileStep } from "./Steps/RegistrationMobileStep";
import { RegistrationPasswordStep } from "./Steps/RegistrationPasswordStep";
import { RegistrationUserInfoStep } from "./Steps/RegistrationUserInfoStep";
import { IDate, IStepProps } from "./types/IRegistration";

class RegistrationComponentsFactory {
  list = {
    [RegistrationStepsEnum.REGISTRATION_EMAIL]: RegistrationEmailStep,
    [RegistrationStepsEnum.REGISTRATION_EMAIL_CONFIRMATION]:
      RegistrationEmailConfirmationStep,
    [RegistrationStepsEnum.REGISTRATION_MOBILE]: RegistrationMobileStep,
    [RegistrationStepsEnum.REGISTRATION_MOBILE_CONFIRMATION]:
      RegistrationMobileConfirmationStep,
    [RegistrationStepsEnum.REGISTRATION_PASSWORD]: RegistrationPasswordStep,
    [RegistrationStepsEnum.REGISTRATION_USER_INFO]: RegistrationUserInfoStep,
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

export const registrationComponentsFactory =
  new RegistrationComponentsFactory();
