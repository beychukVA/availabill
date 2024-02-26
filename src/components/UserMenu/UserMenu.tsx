import { token } from "@/redux/Auth/auth-actions";
import { useAppDispatch } from "@/redux/store";
import React, { useState } from "react";
import { t } from "@lingui/macro";
import { useRouter } from "next/router";
import Link from "next/link";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon/ChevronDownIcon";
import { LogoutIcon } from "../Icons/LogoutIcon/LogoutIcon";
import { NotificationIcon } from "../Icons/NotificationIcon/NotificationIcon";
import { UserAvatar } from "../Icons/UserAvatar/UserAvatar";
import styles from "./UserMenu.module.scss";
import { ICurrentUser } from "../OnboardingSteps/Login/types/ILogin";

interface IProps {
  user: ICurrentUser;
}

// for testing
const notificationCount = 22;

export const UserMenu: React.FC<IProps> = ({ user }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  const logout = () => dispatch(token("", ""));

  const profileMenu = [
    {
      name: t`Einstellungen`,
      icon: null,
      onClick: () => router.push("/profile"),
    },
    {
      name: t`Abmelden`,
      icon: <LogoutIcon />,
      onClick: logout,
    },
  ];

  const toggleProfileMenu = () => setProfileMenuOpen(!isProfileMenuOpen);
  const closeProfileMenu = () => setProfileMenuOpen(false);

  return (
    <div className={styles.userMenu}>
      <div className={styles.notification}>
        <Link href="/inbox">
          <NotificationIcon />
        </Link>
        <div className={styles.notificationCount}>{notificationCount}</div>
      </div>
      <div className={styles.user}>
        <span className={styles.username}>
          {user?.firstName && user?.name
            ? `${user?.firstName.charAt(0)}. ${user?.name}`
            : t`Name nicht verfügbar`}
        </span>
        <div className={styles.avatar}>
          <UserAvatar />
        </div>
        <div
          className={`${styles.arrow} ${
            isProfileMenuOpen ? styles.arrowUp : ""
          }`}
          onClick={toggleProfileMenu}
        >
          <ChevronDownIcon />
        </div>
        <div
          onClick={closeProfileMenu}
          className={`${styles.dropdownWrapper} ${
            isProfileMenuOpen ? styles.showWrapper : ""
          }`}
        />
        <div
          className={`${styles.dropdown} ${
            isProfileMenuOpen ? "" : styles.dropdownHidden
          }`}
        >
          {profileMenu &&
            profileMenu.map((item) => (
              <div
                className={styles.dropdownItem}
                key={item.name}
                onClick={() => {
                  item.onClick();
                  closeProfileMenu();
                }}
              >
                <span className={styles.itemText}>{item.name}</span>
                {item?.icon && (
                  <div className={styles.itemIcon}>{item.icon}</div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
