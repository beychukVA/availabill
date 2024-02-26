import React, { ReactNode, useMemo } from "react";
import styles from "./TransparentButton.module.scss";

interface IProps {
  children?: string;
  textTransform?: "capitalize" | "uppercase";
  onClick: () => void;
  icon?: ReactNode;
  color?: "primary" | "secondary" | "accent";
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  width?: number | "full-width" | "fit-content";
  className?: string;
}

export const TransparentButton: React.FC<IProps> = ({
  children,
  textTransform = "uppercase",
  onClick,
  icon,
  color = "primary",
  pt = 0,
  pr = 0,
  pb = 0,
  pl = 0,
  mt = 0,
  mr = 0,
  mb = 0,
  ml = 0,
  width = "fit-content",
  className,
}) => {
  const widthType = useMemo(() => {
    if (width === "full-width") {
      return "100%";
    }

    return width === "fit-content" ? "fit-content" : `${width}px`;
  }, [width]);

  return (
    <button
      type="button"
      style={{
        padding: `${pt}px ${pr}px ${pb}px ${pl}px`,
        margin: `${mt}px ${mr}px ${mb}px ${ml}px`,
        width: widthType,
      }}
      className={`${styles.button} ${className} ${
        color === "primary"
          ? styles.primary
          : color === "accent"
          ? styles.accent
          : styles.secondary
      }`}
      onClick={(e) => {
        e.currentTarget.blur();
        onClick();
      }}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <span
        className={`${styles.text} ${
          textTransform === "uppercase" ? styles.uppercase : styles.capitalize
        }`}
      >
        {children}
      </span>
    </button>
  );
};
