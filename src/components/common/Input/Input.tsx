import { AttentionIcon } from "@/components/Icons/AttentionIcon/AttentionIcon";
import { getInputType, getWidth } from "@/utils";
import clsx from "clsx";
import React, { ReactNode, useMemo } from "react";
import styles from "./Input.module.scss";
import { IType } from "./types/IType";

interface IProps {
  placeholder?: string;
  label?: string;
  type: IType;
  value: string;
  anchor: string;
  textError?: string;
  icon?: ReactNode;
  onChange: (prop: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  width?: number | "full-width" | "fit-content";
  password?: string;
  editable?: boolean;
}

const formatPhone = (value: string) => {
  if (value.endsWith(" ")) return value.trim();
  if (value.length === 10)
    value = value.replace(new RegExp(`(.){${9}}`), `$&${" "}`);
  if (value.length === 13)
    value = value.replace(new RegExp(`(.){${13}}`), `$&${" "}`);
  if (value.length === 16)
    value = value.replace(new RegExp(`(.){${16}}`), `$&${" "}`);
  return value.startsWith("+41 (0)")
    ? value === "+41 (0)"
      ? ""
      : value
    : value.length > 0
    ? `+41 (0)${value}`
    : "";
};

export const Input: React.FC<IProps> = ({
  value,
  onChange,
  anchor,
  type = "text",
  placeholder = "",
  label = "",
  icon,
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
  password,
  editable = true,
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
    {icon && <div className={styles.icon}>{icon}</div>}
    <div className={styles.errorContainer}>
      <input
        style={{
          padding: `${pt}px ${pr}px ${pb}px ${icon ? 42 : pl}px`,
        }}
        className={clsx(
          styles.input,
          textError ? styles.inputError : "",
          editable ? "" : styles.disabled
        )}
        pattern=""
        placeholder={placeholder}
        type={getInputType(type)}
        value={value}
        onChange={(e) => {
          if (type === "tel") {
            const { value } = e.target;
            if (value.length === 20) return;
            e.target.value = formatPhone(value);
          }
          onChange(anchor)(e);
        }}
        disabled={!editable}
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
