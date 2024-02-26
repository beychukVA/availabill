import React from "react";

export const DownloadTransactionIcon = ({
  size = 18,
  color = "#222222",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 0H16C16.5304 0 17.0391 0.210714 17.4142 0.585786C17.7893 0.960859 18 1.46957 18 2V16C18 17.11 17.11 18 16 18H2C1.46957 18 0.960859 17.7893 0.585786 17.4142C0.210714 17.0391 0 16.5304 0 16V2C0 0.9 0.9 0 2 0ZM5 14H13V12H5V14ZM13 7H10.5V4H7.5V7H5L9 11L13 7Z"
      fill={color}
    />
  </svg>
);
