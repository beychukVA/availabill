import React, { PropsWithChildren, ReactNode, useState } from "react";
import { AccordionSummary, AccordionDetails, Accordion } from "@mui/material";
import styles from "./Accordion.module.scss";
import { ChevronDownCircleIcon } from "../Icons/ChevronDownCircleIcon/ChevronDownCircleIcon";

interface Props {
  heading: string;
  children: (expanded: boolean) => ReactNode;
}

const AccordionComponent = ({ heading, children }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.accordion}>
      <div
        className={styles.accordionHeader}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <h3>{heading}</h3>
        <div
          className={styles.chevron}
          style={{ transform: `rotate(${expanded ? "180deg" : "0deg"})` }}
        >
          <ChevronDownCircleIcon />
        </div>
      </div>
      <Accordion
        expanded={expanded}
        square
        sx={{
          boxShadow: "none",
          marginTop: "0!important",
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
          }}
        >
          {children(expanded)}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default AccordionComponent;
