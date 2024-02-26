import React from "react";

export const CreditCardPlusIcon = ({
  color = "#222222",
}: {
  color?: string;
}) => (
  <svg
    width="32"
    height="33"
    viewBox="0 0 32 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_3480_10765)">
      <path
        d="M28.0026 24.1354H32.0026V26.8021H28.0026V30.8021H25.3359V26.8021H21.3359V24.1354H25.3359V20.1354H28.0026V24.1354ZM25.3359 10.8021V8.13542H4.0026V10.8021H25.3359ZM25.3359 16.1354H4.0026V24.1354H18.6693V26.8021H4.0026C3.29536 26.8021 2.61708 26.5211 2.11699 26.021C1.61689 25.5209 1.33594 24.8427 1.33594 24.1354V8.13542C1.33594 6.65542 2.5226 5.46875 4.0026 5.46875H25.3359C26.0432 5.46875 26.7215 5.7497 27.2216 6.2498C27.7217 6.7499 28.0026 7.42817 28.0026 8.13542V17.4688H25.3359V16.1354Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_3480_10765">
        <rect
          width="32"
          height="32"
          fill="white"
          transform="translate(0 0.132812)"
        />
      </clipPath>
    </defs>
  </svg>
);
