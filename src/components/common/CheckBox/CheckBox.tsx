import React from "react";
import styles from "./CheckBox.module.scss";

export type CheckboxValues = "yes" | "no";
interface IProps {
  labelPosition?: "top" | "right";
  label: string;
  value: CheckboxValues;
  onChange: (prop: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  anchor: string;
  ml?: number;
}

export const CheckBox: React.FC<IProps> = ({
  label,
  labelPosition = "right",
  value,
  onChange,
  anchor,
  ml = 0,
}) => (
  <div style={{ margin: `0 0 0 ${ml}px` }}>
    <input
      className={styles.checkbox}
      type="checkbox"
      id={anchor}
      name={anchor}
      value={value}
      onChange={onChange(anchor)}
    />
    {label && (
      <label
        className={`${labelPosition === "top" ? styles.labelTop : ""}`}
        htmlFor={anchor}
      >
        {label}
      </label>
    )}
  </div>
);
