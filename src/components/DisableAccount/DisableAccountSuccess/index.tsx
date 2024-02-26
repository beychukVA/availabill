import { Button } from "@/components/common/Button/Button";
import { NeedMoreHelp } from "@/components/NeedMoreHelp/NeedMoreHelp";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/router";
import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "./DisableAccountSuccess.module.scss";

interface IProps {
  contentImage: string;
}

// http://localhost:3000/disable-account-success

export const DisableAccountSuccess: React.FC<IProps> = ({ contentImage }) => {
  const { disableAccountSuccess, qaTranslations } = useAppSelector(
    (state) => state.translations
  );
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <div className={styles.sectionTitle}>
          <span className={styles.title}>{disableAccountSuccess?.title}</span>
        </div>
        <div className={styles.sectionImg}>
          <img src={contentImage} alt="" className={styles.contentImg} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.description}>
          <ReactMarkdown>
            {disableAccountSuccess?.description || ""}
          </ReactMarkdown>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            onClick={() => router.push("/onboarding")}
            width="fit-content"
            mt={60}
          >
            {disableAccountSuccess?.deactivationBtn}
          </Button>
        </div>
        <div className={styles.needHelp}>
          <NeedMoreHelp qaTranslations={qaTranslations} />
        </div>
      </div>
    </div>
  );
};
