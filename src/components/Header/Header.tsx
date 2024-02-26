import React from "react";
import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";
import { useAppSelector } from "@/redux/store";
import { useElementHeightObserver } from "@/utility/hooks/use-element-height-observer";
import Link from "next/link";
import { HeaderMenu } from "../HeaderMenu/HeaderMenu";
import SidebarToggle from "../Sidebar/SidebarToggle/SidebarToggle";
import { UserMenu } from "../UserMenu/UserMenu";
import styles from "./Header.module.scss";
import { AvailabillLogoIcon } from "../Icons/AvailabillLogoIcon/AvailabillLogoIcon";

export const Header = ({
  setHeightElement,
}: {
  setHeightElement?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}) => {
  const token = useAppSelector((state) => state.user.token);
  const { data: user } = useGetCurrentUserQuery(token);

  return (
    <header className={styles.header} ref={setHeightElement}>
      <div className={styles.headerContainer}>
        <div className={styles.logoMenu}>
          {user && <SidebarToggle />}
          <Link href="/">
            <div className={styles.logoAvailabill}>
              <AvailabillLogoIcon />
            </div>
          </Link>
        </div>
        {user ? <UserMenu user={user} /> : <HeaderMenu />}
      </div>
    </header>
  );
};
