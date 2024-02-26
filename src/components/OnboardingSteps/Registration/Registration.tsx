import React, { useEffect, useMemo, useState } from "react";
import { IOnboardingMenu } from "@/components/OnboardingMenu/IOnboardingMenu";
import styles from "./Registration.module.scss";
import { RegistrationStepsEnum } from "../lib/RegistrationStepsEnum";
import { registrationComponentsFactory } from "./RegistrationFactory";
import { IDate } from "./types/IRegistration";

interface IProps {
  handleChangeMenu: (itemMenu: string) => void;
  menu: IOnboardingMenu;
  handleChangeStep: (step: string) => void;
}

export const Registration: React.FC<IProps> = ({
  handleChangeMenu,
  menu,
  handleChangeStep,
}) => {
  const [currIndex, setCurrIndex] = useState<number>(0);
  const [step, setStep] = useState<string>(
    RegistrationStepsEnum.REGISTRATION_EMAIL
  );
  const [data, setData] = useState<IDate>({
    email: "",
    emailCode: "",
    onboardingCode: "",
    mobile: "",
    mobileConfirmCode: "",
    password: "",
    passwordConfirm: "",
    gender: "",
    firstName: "",
    lastName: "",
    birthday: "",
  });

  useEffect(() => handleChangeStep(step), [handleChangeStep, step]);

  const values = Object.values(RegistrationStepsEnum);
  const stepIndex = useMemo(() => {
    const index = values?.findIndex((value) => value === step);
    return index;
  }, [step, values]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.progressbar}>
          {Object.values(RegistrationStepsEnum).map((v, index) => {
            if (index > currIndex) setCurrIndex(index);
            const dotCount = index === 0 || index % 2 !== 0;
            const isActive = index === 0 || index < stepIndex;

            return dotCount ? (
              <div
                key={v}
                className={`${styles.step} ${
                  index === 0 ? styles.fixWidth : ""
                }`}
              >
                <div
                  className={`${styles.line} ${
                    index === 0 ? styles.hidden : ""
                  }`}
                />
                <div
                  className={`${styles.dot} ${isActive ? styles.active : ""}`}
                />
              </div>
            ) : null;
          })}
        </div>
        {registrationComponentsFactory.getComponent({
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
