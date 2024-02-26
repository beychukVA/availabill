import { IOnboardingMenu } from "@/components/OnboardingMenu/IOnboardingMenu";
import React, { useEffect, useState } from "react";
import { LoginStepsEnum } from "../lib/LoginStepEnum";
import styles from "./Login.module.scss";
import { loginComponentsFactory } from "./LoginFactory";
import { IDate } from "./types/ILogin";

interface IProps {
  handleChangeMenu: (itemMenu: string) => void;
  menu: IOnboardingMenu;
  handleChangeStep: (step: string) => void;
}

export const Login: React.FC<IProps> = ({
  handleChangeMenu,
  menu,
  handleChangeStep,
}) => {
  const [step, setStep] = useState<string>(LoginStepsEnum.LOGIN_EMAIL);
  const [data, setData] = useState<IDate>({
    email: "",
    emailCode: "",
    password: "",
    token: "",
    resendEmail: "",
  });

  useEffect(() => handleChangeStep(step), [handleChangeStep, step]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {loginComponentsFactory.getComponent({
          handleChangeMenu,
          menu,
          step,
          data,
          setData,
          setStep,
        })}
      </div>
    </div>
  );
};
