import React, { useState } from "react";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { ITab } from "@/pages/profile";
import { TwoFactorAuthentication } from "../../../2FAuthentication/TwoFactorAuthentication";
import { ContactInformation } from "../../../ContactInformation/ContactInformation";
import { DisablePortalAccess } from "../../../DisablePortalAccess/DisablePortalAccess";
import { Language } from "../../../Language/Language";
import { Notifications } from "../../../Notifications/Notifications";
import { Password } from "../../../Password/Password";
import styles from "./DesktopMenu.module.scss";

interface IProps {
  tabs: ITab[];
  user: ICurrentUser;
  updateUI: () => void;
}

export const DesktopMenu: React.FC<IProps> = ({ user, tabs, updateUI }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [isForgotPassword, setForgotPassword] = useState(false);

  const forgotPassword = () => {
    setSelectedTab(tabs[2]);
    setForgotPassword(true);
  };

  return (
    <>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <div
            data-testid={tab.name}
            className={`${styles.tab} ${
              selectedTab.id === tab.id ? styles.activeTab : ""
            }`}
            key={tab.id}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div className={styles.tabContent}>
        {selectedTab.id === 1 && (
          <ContactInformation
            user={user}
            updateUI={updateUI}
            forgotPassword={forgotPassword}
          />
        )}
        {selectedTab.id === 2 && <Language user={user} updateUI={updateUI} />}
        {selectedTab.id === 3 && (
          <Password
            user={user}
            isForgotPassword={isForgotPassword}
            setForgotPassword={setForgotPassword}
          />
        )}
        {selectedTab.id === 4 && <TwoFactorAuthentication />}
        {selectedTab.id === 5 && <Notifications />}
        {selectedTab.id === 6 && <DisablePortalAccess user={user} />}
      </div>
    </>
  );
};
