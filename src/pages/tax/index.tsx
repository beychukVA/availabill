import { PrivateRoute } from "@/components/Routes/PrivateRoute";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setSidebarTranslations } from "@/redux/Strapi/strapi-slice";
import { ISidebarTranslations } from "@/utility/types";
import {
  getStrapiSidebarTranslations,
  getStrapiTranslations,
  getTranslation,
} from "@/utils";
import { GetServerSideProps } from "next";
import React, { useCallback, useEffect, useState } from "react";
import { ChevronDownIcon } from "@/components/Icons/ChevronDownIcon/ChevronDownIcon";
import CardRow from "@/components/CardRow/CardRow";
import Card from "@/components/common/Card/Card";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Button } from "@/components/common/Button/Button";
import { TableComponent } from "@/components/TaxTable/Table";
import { Pagination } from "@/components/Pagination/Pagination";
import {
  useGetCurrentUserAccountsQuery,
  useGetMerchantsQuery,
  useGetUserInterestStatementsQuery,
} from "@/redux/User/Accounts/account-slice";
import { format, subYears } from "date-fns";
import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";
import { useRouter } from "next/router";
import { useGetCardAccountsQuery } from "@/redux/User/Cards/cards-slice";
import Link from "next/link";
import styles from "./TaxReturns.module.scss";

const currentYear = format(new Date(), "yyyy");
const previousYear = format(subYears(new Date(), 1), "yyyy");

interface IProps {
  sidebarTranslations: ISidebarTranslations;
}

const TaxReturns: React.FC<IProps> = ({ sidebarTranslations }) => {
  const token = useAppSelector((state) => state.user.token);
  const dispatch = useAppDispatch();
  const [cardAccountNo, setCardAccountNo] = useState<string>("");

  const [datum, setDatum] = useState<string>(currentYear);
  const [handler, setHandler] = useState<string>("");

  const router = useRouter();
  const { contractNo, merchantId } = router.query;

  const { data: currentUser } = useGetCurrentUserQuery(token);

  useEffect(() => {
    if (merchantId) {
      setHandler(merchantId as string);
    }
  }, [merchantId]);

  useEffect(() => {
    if (contractNo) {
      setCardAccountNo(contractNo as string);
    }
  }, [contractNo]);

  const { data: cardAccounts } = useGetCardAccountsQuery(
    {
      amount: 1000,
    },
    {
      skip: !currentUser?.id,
    }
  );

  const { data } = useGetUserInterestStatementsQuery(
    {
      amount: 1000,
      contractNo: cardAccountNo,
      merchantId: handler,
      page: 0,
      token,
      userId: currentUser?.id,
      year: datum,
    },
    { skip: !currentUser?.id || !contractNo || !merchantId }
  );

  const { data: merchants } = useGetMerchantsQuery(token);

  useEffect(() => {
    dispatch(setSidebarTranslations(sidebarTranslations));
  }, [dispatch, sidebarTranslations]);

  const handleStatusChange = useCallback(
    (event: SelectChangeEvent) =>
      setCardAccountNo(event.target.value as string),
    []
  );

  const handleDatumChange = useCallback(
    (event: SelectChangeEvent) => setDatum(event.target.value as string),
    []
  );

  const handleHandlerChange = useCallback(
    (event: SelectChangeEvent) => setHandler(event.target.value as string),
    []
  );

  const resetFilters = useCallback(() => {
    setCardAccountNo("");
    setHandler("");
    setDatum(currentYear);
  }, []);

  // const [page, setPage] = useState(0);

  return (
    <PrivateRoute>
      <h2 className={styles.heading}>Zinsausweise für Ihre Steuererklärung</h2>
      <Link href="/bills" className={styles.backLink}>
        <ChevronDownIcon />
        <span>Back to invoices page</span>
      </Link>
      <div className={styles.container}>
        <div className={styles.filtersRow}>
          <Card className={styles.filterCard}>
            <h3 className={styles.filterHeading}>
              Suchen Sie einen bestimmten Zinsausweis?
            </h3>
            <div className={styles.filterContent}>
              <div className={styles.filters}>
                <div>
                  <h5>Vertrags - Nr.</h5>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={cardAccountNo}
                      fullWidth
                      onChange={handleStatusChange}
                      displayEmpty
                    >
                      <MenuItem value="">All</MenuItem>
                      {cardAccounts?.content.map((cardAccount) => (
                        <MenuItem
                          key={`contractNo-${cardAccount.contractNo}`}
                          value={cardAccount.contractNo}
                        >
                          {cardAccount.contractNo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <h5>Datum</h5>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={datum}
                      fullWidth
                      onChange={handleDatumChange}
                      displayEmpty
                    >
                      {[currentYear, previousYear].map((date) => (
                        <MenuItem key={`date-${date}`} value={date}>
                          {date}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <h5>Händler</h5>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={`${handler}`}
                      fullWidth
                      onChange={handleHandlerChange}
                      displayEmpty
                    >
                      <MenuItem value="">All</MenuItem>
                      {merchants?.content.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <Button
                width="fit-content"
                className={styles.clearButton}
                variant="gray"
                onClick={resetFilters}
              >
                Clear filter
              </Button>
            </div>
          </Card>
        </div>
        <TableComponent year="2023" data={data?.content || []} />
        <TableComponent data={[]} year="2022" />
        {/* <div className={styles.paginationContainer}>
          <div className={styles.pagination}>
            <Pagination
              count={10}
              page={1}
              handleChange={setPage}
              className={styles.paginationBlock}
              showAllTxt="Weitere anzeigen"
              showMoreTxt="Alle anzeigen"
            />
          </div>
        </div> */}
      </div>
      <Link href="/bills" className={styles.backLink}>
        <ChevronDownIcon />
        <span>Back to invoices page</span>
      </Link>
    </PrivateRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=700"
  );

  const [translation, sidebar] = await Promise.all([
    getTranslation(ctx),
    getStrapiSidebarTranslations(ctx.locale),
  ]);

  return {
    props: {
      translation,
      sidebarTranslations: sidebar,
    },
  };
};

export default TaxReturns;
