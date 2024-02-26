import { Header } from "@/components/Header/Header";
import { SideActions } from "@/components/SideActions/SideActions";
import { useElementHeightObserver } from "@/utility/hooks/use-element-height-observer";
import { t } from "@lingui/macro";
import Head from "next/head";
import React, { ReactNode } from "react";
import styles from "./PublicLayout.module.scss";

interface IProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
}

export const PublicLayout: React.FC<IProps> = ({
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
        <title>{title || t`Disable Account - my.availabill.ch`}</title>
        <meta name="description" content={description || t`Disable Account`} />
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.container}>
        <Header setHeightElement={setHeaderHeight} />
        <div className={styles.content}>
          <div className={styles.main}>{children}</div>
          <SideActions />
        </div>
      </div>
    </>
  );
};
