import React, { useEffect, useState } from "react";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { ITab } from "@/pages/profile";
import { ChevronDownCircleIcon } from "@/components/Icons/ChevronDownCircleIcon/ChevronDownCircleIcon";
import { TwoFactorAuthentication } from "../../../2FAuthentication/TwoFactorAuthentication";
import { ContactInformation } from "../../../ContactInformation/ContactInformation";
import { DisablePortalAccess } from "../../../DisablePortalAccess/DisablePortalAccess";
import { Language } from "../../../Language/Language";
import { Notifications } from "../../../Notifications/Notifications";
import { Password } from "../../../Password/Password";
import styles from "./MobileMenu.module.scss";

interface IProps {
  tabs: ITab[];
  user: ICurrentUser;
  updateUI: () => void;
}

export const MobileMenu: React.FC<IProps> = ({ user, tabs, updateUI }) => {
  const [selectedTabs, setSelectedTabs] = useState<ITab[]>([]);
  const [isForgotPassword, setForgotPassword] = useState(false);

  useEffect(() => {
    if (selectedTabs.length > 0) {
      const tabId = selectedTabs[selectedTabs.length - 1].id;
      const tab = document.getElementById(String(tabId));
      if (tab) {
        tab.scrollIntoView({
          block: "start",
          inline: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedTabs]);

  const isTabOpen = (tab: ITab) =>
    selectedTabs.find((item) => item.id === tab.id);

  const toggleTab = (tab: ITab) => {
    const filter = isTabOpen(tab);
    if (filter) {
      setSelectedTabs((prev) => prev.filter((item) => item.id !== tab.id));
      return;
    }
    setSelectedTabs((prev) => [...prev, tab]);
  };

  const forgotPassword = () => {
    toggleTab(tabs[2]);
    setForgotPassword(true);
  };

  return (
    <>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <div id={String(tab.id)} key={tab.id} className={styles.tabContainer}>
            <div
              data-testid={tab.name}
              className={`${styles.tab} ${
                isTabOpen(tab) ? styles.activeTab : ""
              }`}
              key={tab.id}
              onClick={() => toggleTab(tab)}
            >
              {tab.name}
              <div
                className={`${styles.arrow} ${
                  isTabOpen(tab) ? styles.activeTab : ""
                }`}
              >
                <ChevronDownCircleIcon />
              </div>
            </div>
            <div
              className={`${styles.tabContent} ${
                isTabOpen(tab) ? styles.activeTab : ""
              }`}
            >
              {tab.id === 1 && (
                <ContactInformation
                  updateUI={updateUI}
                  key={tab.name}
                  user={user}
                  forgotPassword={forgotPassword}
                />
              )}
              {tab.id === 2 && (
                <Language key={tab.name} user={user} updateUI={updateUI} />
              )}
              {tab.id === 3 && (
                <Password
                  key={tab.name}
                  user={user}
                  isForgotPassword={isForgotPassword}
                  setForgotPassword={setForgotPassword}
                />
              )}
              {tab.id === 4 && <TwoFactorAuthentication key={tab.name} />}
              {tab.id === 5 && <Notifications key={tab.name} />}
              {tab.id === 6 && (
                <DisablePortalAccess user={user} key={tab.name} />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
