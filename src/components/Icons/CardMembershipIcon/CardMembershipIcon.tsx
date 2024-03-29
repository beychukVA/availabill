import React from "react";

interface IProps {}

export const CardMembershipIcon = ({
  color = "#222222",
  width = "24",
  height = "25",
}: {
  color?: string;
  width?: string;
  height?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 13.5V15.5H20V13.5H4ZM9.45 21.775C9.11667 21.9417 8.79167 21.929 8.475 21.737C8.15834 21.545 8 21.2577 8 20.875V17.5H4C3.45 17.5 2.979 17.304 2.587 16.912C2.195 16.52 1.99934 16.0493 2 15.5V4.5C2 3.95 2.196 3.479 2.588 3.087C2.98 2.695 3.45067 2.49934 4 2.5H20C20.55 2.5 21.021 2.696 21.413 3.088C21.805 3.48 22.0007 3.95067 22 4.5V15.5C22 16.05 21.804 16.521 21.412 16.913C21.02 17.305 20.5493 17.5007 20 17.5H16V20.875C16 21.2583 15.8417 21.546 15.525 21.738C15.2083 21.93 14.8833 21.9423 14.55 21.775L12 20.5L9.45 21.775ZM4 10.5H20V4.5H4V10.5Z"
      fill={color}
    />
  </svg>
);
