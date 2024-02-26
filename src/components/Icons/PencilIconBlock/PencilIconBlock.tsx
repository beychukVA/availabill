import React from "react";

export const PencilIconBlock = ({ color = "#FF8000" }: { color?: string }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="4" fill={color} />
    <path
      d="M18.06 13L19 13.94L9.92 23H9V22.08L18.06 13ZM21.66 7C21.41 7 21.15 7.1 20.96 7.29L19.13 9.12L22.88 12.87L24.71 11.04C25.1 10.65 25.1 10 24.71 9.63L22.37 7.29C22.17 7.09 21.92 7 21.66 7ZM18.06 10.19L7 21.25V25H10.75L21.81 13.94L18.06 10.19Z"
      fill="white"
    />
  </svg>
);
