import React from "react";
import clsx from "clsx";
import styles from "./Radio.module.scss";

interface IProps {
  name?: string;
  value: string;
  text: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  className?: string;
}

export const Radio: React.FC<IProps> = ({
  name = "",
  value = "",
  text = "",
  onChange,
  checked,
  pt = 0,
  pr = 0,
  pb = 0,
  pl = 0,
  mt = 0,
  mr = 0,
  mb = 0,
  ml = 0,
  className,
}) => (
  <div
    style={{
      margin: `${mt}px ${mr}px ${mb}px ${ml}px`,
      padding: `${pt}px ${pr}px ${pb}px ${pl}px`,
    }}
    className={clsx(styles.radio, className)}
  >
    <input
      id={`radio-${value}`}
      className={styles.radioInput}
      type="radio"
      name={name}
      onChange={onChange}
      value={value}
      checked={checked}
    />
    <label htmlFor={`radio-${value}`} className={styles.radioLabel}>
      {text}
    </label>
  </div>
);
