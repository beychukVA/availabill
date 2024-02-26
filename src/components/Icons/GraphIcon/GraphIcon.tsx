import React from "react";

export const GraphIcon = ({ color = "#FF8000" }: { color?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 14H4V7H6V14ZM10 14H8V4H10V14ZM14 14H12V10H14V14ZM16 16H2V2H16V16.1M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0Z"
      fill={color}
    />
  </svg>
);
