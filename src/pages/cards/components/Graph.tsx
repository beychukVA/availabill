import React from "react";
import clsx from "clsx";

import { toFixedAmount } from "@/utils";
import { useGetGraphData, dayNames, monthNames } from "@/hooks/useGetGraphData";
import styles from "./Graph.module.scss";

const Graph = ({ cardId }: { cardId: number | undefined }) => {
  const { setMonthSelected, monthSelected, values, maxValue } =
    useGetGraphData(cardId);

  return (
    <div className={styles.container}>
      <div className={styles.calendarBlock}>
        <div className={styles.blockHeading}>
          <span
            className={clsx(
              !monthSelected && styles.active,
              styles.periodOfTime
            )}
            onClick={() => setMonthSelected(false)}
          >
            Woche
          </span>
          <span
            className={clsx(
              monthSelected && styles.active,
              styles.periodOfTime
            )}
            onClick={() => setMonthSelected(true)}
          >
            Monat
          </span>
        </div>
        <div className={styles.graphBlock}>
          {Array.from({ length: 7 }, () => null).map((_, index) => (
            <div key={dayNames[index]}>
              <div
                className={styles.graph}
                title={toFixedAmount(values[index])}
                style={{
                  height: `${(values[index] / maxValue) * 100 || 0}%`,
                }}
              />
              <span>{monthSelected ? monthNames[index] : dayNames[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Graph;
