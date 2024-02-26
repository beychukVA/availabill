import { IQATranslations } from "@/utility/types";
import React, { useState } from "react";
import Phone from "@mui/icons-material/PhoneOutlined";
import Mail from "@mui/icons-material/MailOutline";
import { useRouter } from "next/router";
import { CallUsModal } from "../CallUsModal/CallUsModal";
import { Button } from "../common/Button/Button";
import { Modal } from "../common/Modal/Modal";
import { TransparentButton } from "../common/TransparentButton/TransparentButton";
import styles from "./NeedMoreHelp.module.scss";

interface IProps {
  qaTranslations: IQATranslations | null;
}

export const NeedMoreHelp: React.FC<IProps> = ({ qaTranslations }) => {
  const [isCallUsModalOpen, setCallUsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <span className={styles.title}>{qaTranslations?.needMoreHelp}</span>
      <div className={styles.contacts}>
        <TransparentButton
          className={styles.link}
          color="accent"
          width="fit-content"
          onClick={() => router.push("/contact-us")}
          icon={<Mail sx={{ color: "#222222" }} />}
        >
          {qaTranslations?.sendUsAMessage}
        </TransparentButton>
        <TransparentButton
          className={styles.link}
          mt={9}
          mb={48}
          color="accent"
          width="fit-content"
          onClick={() => setCallUsModalOpen(true)}
          icon={<Phone sx={{ color: "#222222" }} />}
        >
          {qaTranslations?.callUsBtn}
        </TransparentButton>
      </div>
      <Button width="fit-content" onClick={() => router.push("/contact-us")}>
        {qaTranslations?.toContactFormBtn}
      </Button>
      <Modal isModalOpen={isCallUsModalOpen} onClose={setCallUsModalOpen}>
        <CallUsModal
          qaTranslations={qaTranslations}
          isOpen={isCallUsModalOpen}
          onClose={setCallUsModalOpen}
        />
      </Modal>
    </>
  );
};
