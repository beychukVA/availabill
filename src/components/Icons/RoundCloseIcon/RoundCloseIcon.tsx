import React from "react";

export const RoundCloseIcon = ({ color = "#fff" }: { color?: string }) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={color}
      d="M8 14C4.6925 14 2 11.3075 2 8C2 4.6925 4.6925 2 8 2C11.3075 2 14 4.6925 14 8C14 11.3075 11.3075 14 8 14ZM8 0.5C3.8525 0.5 0.5 3.8525 0.5 8C0.5 12.1475 3.8525 15.5 8 15.5C12.1475 15.5 15.5 12.1475 15.5 8C15.5 3.8525 12.1475 0.5 8 0.5ZM9.9425 5L8 6.9425L6.0575 5L5 6.0575L6.9425 8L5 9.9425L6.0575 11L8 9.0575L9.9425 11L11 9.9425L9.0575 8L11 6.0575L9.9425 5Z"
    />
  </svg>
);
