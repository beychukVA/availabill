import React from "react";
import { Trans, t } from "@lingui/macro";
import { useMediaQuery } from "@mui/material";
import { useAppSelector } from "@/redux/store";
import { IOnboardingMenu } from "./IOnboardingMenu";
import { Button } from "../common/Button/Button";
import { SectionTitle } from "../common/SectionTitle/SectionTitle";
import styles from "./OnboardingMenu.module.scss";

interface IProps {
  menu: IOnboardingMenu;
  handleChangeMenu: (menuItem: string) => void;
}

export const OnboardingMenu: React.FC<IProps> = ({
  menu,
  handleChangeMenu,
}) => {
  const matches = useMediaQuery("(min-width:1200px)");
  const { onboardingTranslations } = useAppSelector(
    (state) => state.translations
  );

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {matches && (
          <SectionTitle maxWidth="185px">
            {onboardingTranslations?.greeting}
          </SectionTitle>
        )}
        <span className={styles.subTitle}>
          {onboardingTranslations?.newHere}
        </span>
        <span className={styles.subDescription}>
          {onboardingTranslations?.registerNowTxt}
        </span>
        <Button
          mt={matches ? 64 : 32}
          pt={14}
          pr={20}
          pb={14}
          pl={20}
          onClick={() => handleChangeMenu(menu.MENU_REGISTRATION)}
        >
          {onboardingTranslations?.registerCTA}
        </Button>
        <Button
          mt={11}
          mb={matches ? 64 : 36}
          pt={14}
          pr={20}
          pb={14}
          pl={20}
          variant="white"
          onClick={() => {
            handleChangeMenu(menu.MENU_LOGIN);
          }}
        >
          {onboardingTranslations?.loginCTA}
        </Button>

        <p className={styles.description}>
          {onboardingTranslations?.onboardingSubTxt_1}
          <br />
          <br />
          {onboardingTranslations?.onboardingSubTxt_2}
        </p>
      </div>
    </div>
  );
};
