import { Trans } from "@lingui/macro";
import { useMediaQuery } from "@mui/material";
import clsx from "clsx";
import React from "react";
import styles from "./OnboardingRightContainer.module.scss";
import { RightContent } from "./RightContent/RightContent";

interface IProps {
  contentImg: string;
}

export const OnboardingRightContainer: React.FC<IProps> = ({ contentImg }) => {
  const matches1200 = useMediaQuery("(min-width:1200px)");
  const matches600 = useMediaQuery("(max-width:600px)");
  return (
    <div className={clsx(styles.rightContainer, styles[contentImg])}>
      <div className={styles.backdrop}>
        {matches1200 ? (
          <RightContent />
        ) : matches600 && contentImg === "onboarding" ? (
          <RightContent />
        ) : null}
      </div>
    </div>
  );
};
