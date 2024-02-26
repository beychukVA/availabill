import { ICurrentUserAccounts } from "@/redux/User/Accounts/account-slice";
import clsx from "clsx";
import React from "react";
import { useAppSelector } from "@/redux/store";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import { IAdditionalEmailsResponse } from "@/redux/User/Profile/types/IProfile";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import styles from "./CardUserInfo.module.scss";

const CardUserInfo = ({
  karAccounts,
  className,
  openAddEmailModal,
  user,
}: {
  karAccounts: IAdditionalEmailsResponse | undefined;
  className: string;
  openAddEmailModal: (isOpen: boolean) => void;
  user: ICurrentUser | undefined;
}) => {
  const { dashboardTranslations } = useAppSelector(
    (state) => state.translations
  );

  return (
    <div className={clsx(styles.cardInfo, className)}>
      <div className={styles.mainInfo}>
        {dashboardTranslations?.emailAddressesAvailabill}
      </div>
      <div className={styles.emailAdresses}>
        {karAccounts?.content.map(({ id, email, confirmed }) => {
          if (email === user?.email) {
            return null;
          }

          return (
            <div data-testid="emailKarAccount" key={id}>
              {email}
            </div>
          );
        })}
      </div>
      <div className={styles.addAdress}>
        <TransparentButton
          mt={16}
          color="secondary"
          onClick={() => {
            openAddEmailModal(true);
          }}
        >
          {dashboardTranslations?.addEmailAddress}
        </TransparentButton>
      </div>
    </div>
  );
};

export default CardUserInfo;
