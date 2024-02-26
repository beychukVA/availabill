import { useAppDispatch, useAppSelector } from "@/redux/store";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Trans, t } from "@lingui/macro";
import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";
import { toggleSidebar } from "@/redux/UI/ui-slice";
import styles from "./Sidebar.module.scss";
import { SidebarProfileIcon } from "../Icons/SidebarProfileIcon/SidebarProfileIcon";
import { BellIcon } from "../Icons/BellIcon/BellIcon";
import { QAIcon } from "../Icons/QAIcon/QAIcon";

export const Sidebar = ({ headerHeight }: { headerHeight: number }) => {
  const { pathname } = useRouter();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { sidebarTranslations } = useAppSelector((state) => state.translations);
  const token = useAppSelector((state) => state.user.token);
  const { data: user } = useGetCurrentUserQuery(token);
  const dispatch = useAppDispatch();

  const topRoutes = useMemo(
    () => [
      { path: "/", title: sidebarTranslations?.yourAvailabill, testId: "main" },
      {
        path: "/bills",
        title: sidebarTranslations?.yourBills,
        testId: "bills",
      },
      {
        path: "/cards",
        title: sidebarTranslations?.cardsAndAccounts,
        testId: "cards",
      },
    ],
    [
      sidebarTranslations?.cardsAndAccounts,
      sidebarTranslations?.yourAvailabill,
      sidebarTranslations?.yourBills,
    ]
  );

  const bottomRoutes = useMemo(
    () => [
      {
        path: "/profile",
        title: sidebarTranslations?.yourSettings,
        testId: "profile",
        icon: <SidebarProfileIcon />,
      },
      {
        path: "/inbox",
        title: sidebarTranslations?.notifications,
        testId: "alerts",
        icon: <BellIcon />,
      },
      {
        path: "/qa",
        title: sidebarTranslations?.customerService,
        testId: "qa",
        icon: <QAIcon />,
      },
    ],
    [
      sidebarTranslations?.customerService,
      sidebarTranslations?.notifications,
      sidebarTranslations?.yourSettings,
    ]
  );

  const renderTopRoutes = useMemo(
    () =>
      topRoutes.map(({ path, title, testId }) => (
        <Link
          data-testid={testId}
          key={path}
          className={clsx(styles.navLink, pathname === path && styles.active)}
          href={path}
          onClick={
            sidebarOpen
              ? () => {
                  dispatch(toggleSidebar());
                }
              : () => {}
          }
        >
          <Trans>{title}</Trans>
        </Link>
      )),
    [dispatch, pathname, sidebarOpen, topRoutes]
  );

  const renderBottomRoutes = useMemo(
    () =>
      bottomRoutes.map(({ path, title, testId, icon }) => (
        <Link
          data-testid={testId}
          key={path}
          className={clsx(styles.navLink, pathname === path && styles.active)}
          href={path}
          onClick={
            sidebarOpen
              ? () => {
                  dispatch(toggleSidebar());
                }
              : () => {}
          }
        >
          <div
            style={{
              width: "25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {icon}
          </div>
          <Trans>{title}</Trans>
        </Link>
      )),
    [bottomRoutes, dispatch, pathname, sidebarOpen]
  );

  if (!user) {
    return null;
  }

  const heightRemove = headerHeight + 5;

  return (
    <div
      className={clsx(styles.sidebar, sidebarOpen && styles.open)}
      style={{
        top: `${headerHeight + 2}px`,
        height: `calc(100vh - ${heightRemove}px)`,
      }}
    >
      <div>{renderTopRoutes}</div>
      <div>{renderBottomRoutes}</div>
    </div>
  );
};
