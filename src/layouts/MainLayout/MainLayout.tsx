import React, { ReactNode } from "react";
import { t } from "@lingui/macro";
import Head from "next/head";
import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { SideActions } from "@/components/SideActions/SideActions";
import { useElementHeightObserver } from "@/utility/hooks/use-element-height-observer";
import styles from "./MainLayout.module.scss";

interface IProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
}

export const MainLayout: React.FC<IProps> = ({
  children,
  title,
  description,
  keywords,
}) => {
  const { setElement: setHeaderHeight, height: headerHeight } =
    useElementHeightObserver();

  return (
    <>
      <Head>
        <title>{title || t`Dashboard - my.availabill.ch`}</title>
        <meta name="description" content={description || t`Armaturenbrett`} />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={keywords || t`armaturenbrett`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.container}>
        <Header setHeightElement={setHeaderHeight} />
        <div className={styles.content}>
          <Sidebar headerHeight={headerHeight} />
          <div className={styles.main}>{children}</div>
          <SideActions />
        </div>
      </div>
    </>
  );
};
