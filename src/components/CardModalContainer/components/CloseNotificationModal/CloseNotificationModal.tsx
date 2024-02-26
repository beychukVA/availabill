import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./CloseNotificationModal.module.scss";
import { Button } from "../../../common/Button/Button";

const CloseNotificationModal = ({
  heading,
  firstParagraph,
  secondParagraph,
  setIsModalOpen,
}: {
  heading: string;
  firstParagraph: string;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  secondParagraph?: string;
}) => (
  <div className={styles.modalInnerContent}>
    <h4>{heading}</h4>
    <p>{firstParagraph}</p>
    {secondParagraph && <p>{secondParagraph}</p>}
    <div className={styles.buttonBlock}>
      <Button
        variant="black"
        mt={0}
        mb={0}
        ml={0}
        mr={10}
        pt={8}
        pb={8}
        width="fit-content"
        onClick={() => setIsModalOpen(false)}
      >
        schliessen
      </Button>
    </div>
  </div>
);

export default CloseNotificationModal;
