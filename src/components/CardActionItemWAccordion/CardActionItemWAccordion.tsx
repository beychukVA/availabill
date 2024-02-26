import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import clsx from "clsx";
import { AccordionDetails, AccordionSummary, Accordion } from "@mui/material";
import styles from "./CardActionItemWAccordion.module.scss";
import { PencilIconBlock } from "../Icons/PencilIconBlock/PencilIconBlock";
import { LetterIcon } from "../Icons/LetterIcon/LetterIcon";
import { PersonIcon } from "../Icons/PersonIcon/PersonIcon";
import { UploadIconSquared } from "../Icons/UploadIconSquared/UploadIconSquared";
import { GraphIcon } from "../Icons/GraphIcon/GraphIcon";
import { ModalType } from "../CardModalContainer/CardModalContainer";
import { PopoverWrapper } from "../Popover/Popover";
import { Radio } from "../common/Radio/Radio";

const invoiceShippingTypes = ["Papierrechnung", "E-Mail Rechnung"];

type Props = {
  setModalType: Dispatch<SetStateAction<"" | ModalType>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setPortalModalVisible: Dispatch<SetStateAction<boolean>>;
};

const CardActionItemWAccordion = ({
  setModalType,
  setIsModalOpen,
  setPortalModalVisible,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRadioType, setSelectedRadioType] = useState("");

  const openModal = useCallback(
    (modalType: ModalType) => {
      setModalType(modalType);
      setIsModalOpen(true);
      setPortalModalVisible(true);
    },
    [setIsModalOpen, setModalType, setPortalModalVisible]
  );

  const handlePopoverClick = (event: any) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const selectPopupRadio = (invoiceType: string) => {
    setSelectedRadioType(invoiceType);

    if (invoiceType === invoiceShippingTypes[1]) {
      openModal(ModalType.SHIPPING_MONTHLY_INVOICE);
      setAnchorEl(null);
      setSelectedRadioType("");
    }
  };

  return (
    <>
      <div
        className={clsx(
          styles.accordionClick,
          styles.actionBlock,
          expanded && styles.active
        )}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <PencilIconBlock />
        <span>Weitere Aktionen</span>
      </div>
      <Accordion
        expanded={expanded}
        square
        sx={{
          boxShadow: "none",
          marginTop: "0!important",
          background: expanded ? "#F2F2F2" : "white",
          transition: "0.2s ease-in-out",
          flex: "0 0 100%",
          padding: "0",
          borderRadius: "4px",
          "&:before": {
            backgroundColor: "transparent !important",
          },
        }}
      >
        <AccordionSummary hidden sx={{ display: "none" }} />
        <AccordionDetails
          sx={{
            padding: 0,
            border: 0,
            boxShadow: "none",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <div
            className={styles.actionBlock}
            onClick={() => openModal(ModalType.NAME_EDIT_MODAL)}
          >
            <div className={styles.iconBlock}>
              <PersonIcon />
            </div>
            <span>Name Ändern</span>
          </div>
          <div
            className={styles.actionBlock}
            onClick={() => openModal(ModalType.CHANGE_EMAIL_MODAL)}
          >
            <div className={styles.iconBlock}>
              <LetterIcon color="#FF8000" />
            </div>
            <span>E-Mail Adresse ändern</span>
          </div>
          <div
            className={styles.actionBlock}
            onClick={() => {
              openModal(ModalType.INCREASE_LIMIT_MODAL);
            }}
          >
            <div className={styles.iconBlock}>
              <UploadIconSquared />
            </div>
            <span>Limitenerhöhung beantragen</span>
          </div>
          <div
            className={styles.actionBlock}
            onClick={() => {
              openModal(ModalType.DECREASE_LIMIT_MODAL);
            }}
          >
            <div className={clsx(styles.iconBlock, styles.reverseIcon)}>
              <UploadIconSquared />
            </div>
            <span>Limitensenkung beantragen</span>
          </div>
          <div
            className={styles.actionBlock}
            onClick={(e) => {
              handlePopoverClick(e);
            }}
          >
            <div className={styles.iconBlock}>
              <GraphIcon color="#FF8000" />
            </div>
            <span>Versandart Monatsrechnung</span>
            <PopoverWrapper anchorEl={anchorEl}>
              <div className={styles.modalPopover}>
                <div className={styles.explanation}>Rechnungenseunstellung</div>
                {invoiceShippingTypes.map((invoiceType) => (
                  <Radio
                    key={invoiceType}
                    text={invoiceType}
                    onChange={() => selectPopupRadio(invoiceType)}
                    value={invoiceType}
                    mb={10}
                    className={styles.modalRadio}
                    checked={invoiceType === selectedRadioType}
                  />
                ))}
              </div>
            </PopoverWrapper>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default CardActionItemWAccordion;
