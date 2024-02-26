import { Header } from "@/components/Header/Header";
import { Trans } from "@lingui/macro";
import { OnboardingFooter } from "@/components/OnboardingFooter/OnboardingFooter";
import { LoginStepsEnum } from "@/components/OnboardingSteps/lib/LoginStepEnum";
import { RegistrationStepsEnum } from "@/components/OnboardingSteps/lib/RegistrationStepsEnum";
import React, { ReactNode, useMemo } from "react";
import clsx from "clsx";
import { useMediaQuery } from "@mui/material";
import { OnboardingRightContainer } from "@/components/OnboardingRightContainer/OnboardingRightContainer";
import styles from "./OnboardingLayout.module.scss";

interface IProps {
  children: ReactNode;
  step: string | null;
}

export const OnboardingLayout: React.FC<IProps> = ({ children, step }) => {
  // const [contentImg, setContentImg] = useState<string>('onboarding');
  const matches = useMediaQuery("(min-width:1200px)");

  const contentImg = useMemo(() => {
    const switchContentImg = (step: string | null) => {
      switch (step) {
        case LoginStepsEnum.LOGIN_EMAIL:
          return "login_email";
        case LoginStepsEnum.LOGIN_EMAIL_CONFIRMATION:
          return "login_email_confirmation";
        case RegistrationStepsEnum.REGISTRATION_EMAIL:
          return "registration_email";
        case RegistrationStepsEnum.REGISTRATION_EMAIL_CONFIRMATION:
          return "registration_email_confirmation";
        case RegistrationStepsEnum.REGISTRATION_MOBILE:
          return "registration_mobile";
        case RegistrationStepsEnum.REGISTRATION_MOBILE_CONFIRMATION:
          return "registration_mobile_confirmation";
        case RegistrationStepsEnum.REGISTRATION_PASSWORD:
          return "registration_password";
        case RegistrationStepsEnum.REGISTRATION_USER_INFO:
          return "registration_user_info";

        default:
          return "onboarding";
      }
    };

    return switchContentImg(step);
  }, [step]);

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <Header />
        {!matches && <OnboardingRightContainer contentImg={contentImg} />}
        <div className={styles.children}>{children}</div>
        <OnboardingFooter />
      </div>
      {matches && <OnboardingRightContainer contentImg={contentImg} />}
    </div>
  );
};
