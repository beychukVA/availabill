import React from "react";

export const UserAvatar = ({ color = "#222222" }: { color?: string }) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 9C16.8875 9 15.7999 9.3299 14.8749 9.94798C13.9499 10.5661 13.2289 11.4446 12.8032 12.4724C12.3774 13.5002 12.266 14.6312 12.4831 15.7224C12.7001 16.8135 13.2359 17.8158 14.0225 18.6025C14.8092 19.3891 15.8115 19.9249 16.9026 20.1419C17.9938 20.359 19.1248 20.2476 20.1526 19.8218C21.1804 19.3961 22.0589 18.6751 22.677 17.7501C23.2951 16.8251 23.625 15.7375 23.625 14.625C23.625 13.1332 23.0324 11.7024 21.9775 10.6475C20.9226 9.59263 19.4918 9 18 9ZM18 18C17.3325 18 16.68 17.8021 16.125 17.4312C15.5699 17.0604 15.1374 16.5333 14.8819 15.9166C14.6265 15.2999 14.5596 14.6213 14.6899 13.9666C14.8201 13.3119 15.1415 12.7105 15.6135 12.2385C16.0855 11.7665 16.6869 11.4451 17.3416 11.3148C17.9963 11.1846 18.6749 11.2515 19.2916 11.5069C19.9083 11.7624 20.4354 12.1949 20.8062 12.75C21.1771 13.305 21.375 13.9575 21.375 14.625C21.3741 15.5198 21.0182 16.3778 20.3855 17.0105C19.7528 17.6432 18.8948 17.9991 18 18Z"
      fill={color}
    />
    <path
      d="M18 2.25C14.885 2.25 11.8398 3.17372 9.24978 4.90435C6.6597 6.63499 4.64098 9.0948 3.4489 11.9727C2.25682 14.8507 1.94492 18.0175 2.55264 21.0727C3.16036 24.1279 4.6604 26.9343 6.86307 29.1369C9.06575 31.3396 11.8721 32.8397 14.9273 33.4474C17.9825 34.0551 21.1493 33.7432 24.0273 32.5511C26.9052 31.359 29.365 29.3403 31.0957 26.7502C32.8263 24.1602 33.75 21.1151 33.75 18C33.7452 13.8243 32.0843 9.821 29.1317 6.86833C26.179 3.91566 22.1757 2.25476 18 2.25ZM11.25 29.6741V28.125C11.2509 27.2302 11.6068 26.3722 12.2395 25.7395C12.8723 25.1068 13.7302 24.7509 14.625 24.75H21.375C22.2698 24.7509 23.1278 25.1068 23.7605 25.7395C24.3932 26.3722 24.7491 27.2302 24.75 28.125V29.6741C22.7016 30.8702 20.3721 31.5005 18 31.5005C15.6279 31.5005 13.2984 30.8702 11.25 29.6741ZM26.991 28.0417C26.9686 26.5661 26.3674 25.1584 25.3169 24.1218C24.2664 23.0852 22.8508 22.5028 21.375 22.5H14.625C13.1492 22.5028 11.7336 23.0852 10.6831 24.1218C9.63264 25.1584 9.03143 26.5661 9.00901 28.0417C6.96889 26.2201 5.5302 23.8217 4.88345 21.1642C4.23669 18.5068 4.41237 15.7155 5.38723 13.1601C6.36208 10.6047 8.09013 8.40563 10.3426 6.85414C12.595 5.30265 15.2655 4.4719 18.0006 4.4719C20.7356 4.4719 23.4062 5.30265 25.6586 6.85414C27.911 8.40563 29.6391 10.6047 30.6139 13.1601C31.5888 15.7155 31.7645 18.5068 31.1177 21.1642C30.4709 23.8217 29.0311 26.2201 26.991 28.0417Z"
      fill={color}
    />
  </svg>
);