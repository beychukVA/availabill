import { AttentionIcon } from "@/components/Icons/AttentionIcon/AttentionIcon";
import { getWidth } from "@/utils";
import React from "react";
import styles from "./TextArea.module.scss";

interface IProps {
  placeholder?: string;
  label?: string;
  value: string;
  anchor: string;
  textError?: string;
  onChange: (
    prop: string
  ) => (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  width?: number | "full-width" | "fit-content";
}

export const TextArea: React.FC<IProps> = ({
  value,
  onChange,
  anchor,
  placeholder = "",
  label = "",
  pt = 8,
  pr = 12,
  pb = 8,
  pl = 12,
  mt = 0,
  mr = 0,
  mb = 0,
  ml = 0,
  width = "full-width",
  textError = "",
}) => (
  <div
    style={{
      margin: `${mt}px ${mr}px ${mb}px ${ml}px`,
      width: getWidth(width),
    }}
    className={styles.container}
  >
    {label && (
      <label
        htmlFor="error-message"
        className={`${styles.label} ${textError ? styles.labelError : ""}`}
      >
        {label}
      </label>
    )}
    <div className={styles.errorContainer}>
      <textarea
        style={{
          padding: `${pt}px ${pr}px ${pb}px ${pl}px`,
        }}
        className={`${styles.textarea} ${
          textError ? styles.textareaError : ""
        }`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(anchor)(e);
        }}
      />
      {textError && (
        <div
          style={{
            padding: `${pt}px 6px ${pb}px 6px`,
          }}
          className={styles.error}
        >
          <AttentionIcon />
        </div>
      )}
    </div>
    {textError && <span className={styles.textError}>{textError}</span>}
  </div>
);
