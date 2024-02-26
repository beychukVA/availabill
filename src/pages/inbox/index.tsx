import { PrivateRoute } from "@/components/Routes/PrivateRoute";
import {
  getStrapiSidebarTranslations,
  getStrapiTranslations,
  getTranslation,
} from "@/utils";
import { GetServerSideProps } from "next";

import { InboxTableComponent } from "@/components/InboxTable/Table";
import Card from "@/components/common/Card/Card";
import { Pagination } from "@/components/Pagination/Pagination";
import { useGetNotificationsQuery } from "@/redux/User/Notifications/notifications-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";
import {
  setInboxTranslations,
  setSidebarTranslations,
} from "@/redux/Strapi/strapi-slice";
import { IInboxTranslations, ISidebarTranslations } from "@/utility/types";
import styles from "./Inbox.module.scss";

interface IInboxProps {
  inboxTranslations: IInboxTranslations;
  sidebarTranslations: ISidebarTranslations;
}

const ImpressumPage = ({
  inboxTranslations,
  sidebarTranslations,
}: IInboxProps) => {
  const [page, setPage] = useState(0);
  const token = useAppSelector((state) => state.user.token);
  const dispatch = useAppDispatch();
  const { data: user } = useGetCurrentUserQuery(token);

  const { data } = useGetNotificationsQuery(
    { userId: user?.id!, page },
    { skip: !user?.id }
  );

  useEffect(() => {
    dispatch(setInboxTranslations(inboxTranslations));
    dispatch(setSidebarTranslations(sidebarTranslations));
  }, [dispatch, inboxTranslations, sidebarTranslations]);

  return (
    <PrivateRoute>
      <div className={styles.container}>
        <h2 className={styles.heading}>{inboxTranslations?.mainHeading}</h2>
        <div className={styles.content}>
          {data?.content.length ? (
            <>
              <div className={styles.table}>
                <InboxTableComponent inboxData={data.content} />
              </div>
              <div className={styles.paginationContainer}>
                <div className={styles.pagination}>
                  <Pagination
                    count={data.totalPages}
                    page={data.number + 1}
                    handleChange={setPage}
                    showAllTxt={inboxTranslations?.showAll}
                    showMoreTxt={inboxTranslations?.showMore}
                    className={styles.paginationBlock}
                  />
                </div>
              </div>
            </>
          ) : (
            <Card className={styles.noData}>
              <div>
                <span>{inboxTranslations?.noData}</span>
              </div>
              <p className={styles.paragraph}>
                {inboxTranslations?.yourInboxEmpty}
              </p>
            </Card>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=10000"
  );

  const [translation, data, sidebar] = await Promise.all([
    getTranslation(ctx),
    getStrapiTranslations(`inbox?locale=${ctx.locale}`),
    getStrapiSidebarTranslations(ctx.locale),
  ]);

  return {
    props: {
      translation,
      inboxTranslations: data,
      sidebarTranslations: sidebar,
    },
  };
};

export default ImpressumPage;
