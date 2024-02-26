import { PrivateRoute } from "@/components/Routes/PrivateRoute";
import { GetServerSideProps } from "next";
import {
  getStrapiSidebarTranslations,
  getStrapiTranslations,
  getTranslation,
  toFixedAmount,
} from "@/utils";
import { VerifiedCard } from "@/components/Icons/VerifiedCard/VerifiedCard";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Card,
  debounce,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Snackbar,
} from "@mui/material";
import CardRow from "@/components/CardRow/CardRow";
import AddEmail from "@/components/AddEmail/AddEmail";
import InterestStatements from "@/components/InterestStatements/InterestStatements";
import MonthlyStatement from "@/components/MonthlyStatement/MonthlyStatement";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  useGetCurrentUserQuery,
  useOneTimePasswordCodeQuery,
} from "@/redux/Auth/auth-slice";
import {
  useGetMerchantsQuery,
  useGetTransactionsMaxAmountQuery,
  useGetUserTransactionsQuery,
} from "@/redux/User/Accounts/account-slice";
import { Pagination } from "@/components/Pagination/Pagination";
import { DownloadTransactionIcon } from "@/components/Icons/DownloadTransactionIcon/DownloadTransactionIcon";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { t, Trans } from "@lingui/macro";
import { Modal } from "@/components/common/Modal/Modal";
import { Button } from "@/components/common/Button/Button";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addYears, endOfYear, format, isSameDay, startOfYear } from "date-fns";
import {
  createStaticRanges,
  DateRangePicker,
  defaultStaticRanges,
} from "react-date-range";
import { CalendarIcon } from "@/components/Icons/CalendarIcon/CalendarIcon";
import { CheckIcon } from "@/components/Icons/CheckIcon/CheckIcon";
import { TableComponent } from "@/components/Table/Table";
import {
  IBillsTranslations,
  IProfileTranslations,
  ISidebarTranslations,
} from "@/utility/types";
import {
  setBillsTranslations,
  setProfileTranslations,
  setSidebarTranslations,
} from "@/redux/Strapi/strapi-slice";
import { ToastError } from "@/components/Toasts/ToastError/ToastError";
import { AddOrEditAdditionalEmailModal } from "@/components/Settings/ContactInformation/Modal/AdditionalEmailModals/AddOrEditAdditionalEmailModal/AddOrEditAdditionalEmailModal";
import { AddEmailConfirmationModal } from "@/components/Settings/ContactInformation/Modal/AdditionalEmailModals/AddEmailConfirmationModal/AddEmailConfirmationModal";
import { useGetAdditionEmailsQuery } from "@/redux/User/Profile/profile-slice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/router";
import JSZip from "jszip";
import clsx from "clsx";
import styles from "./Bills.module.scss";

export const staticRanges = createStaticRanges([
  {
    label: "This Year",
    range: () => ({
      startDate: startOfYear(new Date()),
      endDate: endOfYear(new Date()),
    }),
    isSelected(range) {
      const definedRange = this.range();

      return (
        isSameDay(range.startDate!, definedRange.startDate!) &&
        isSameDay(range.endDate!, definedRange.endDate!)
      );
    },
  },
  {
    label: "Last Year",
    range: () => ({
      startDate: startOfYear(addYears(new Date(), -1)),
      endDate: endOfYear(addYears(new Date(), -1)),
    }),
    isSelected(range) {
      const definedRange = this.range();

      return (
        isSameDay(range.startDate!, definedRange.startDate!) &&
        isSameDay(range.endDate!, definedRange.endDate!)
      );
    },
  },
]);

interface IBillsPageProps {
  billsTranslations: IBillsTranslations;
  sidebarTranslations: ISidebarTranslations;
  profileTranslations: IProfileTranslations;
}

const BillsPage = ({
  billsTranslations,
  sidebarTranslations,
  profileTranslations,
}: IBillsPageProps) => {
  const token = useAppSelector((state) => state.user.token);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const [oneTimeCodeReference, setOneTimeCodeReference] = useState("");
  const [passwordType, setPasswordType] = useState("");
  const [isToastErrorOpen, setToastErrorOpen] = useState(false);
  const [currAdditionEmail, setCurrAdditionEmail] = useState("");
  const [isEditCurrEmail, setEditCurrEmail] = useState(false);
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [
    isAddOrEditAdditionalEmailModalOpen,
    setAddOrEditAdditionalEmailModalOpen,
  ] = useState(false);
  const [isAddEmailConfirmationModalOpen, setAddEmailConfirmationModalOpen] =
    useState(false);

  useEffect(() => {
    if (serverErrors._errors[0]) {
      setToastErrorOpen(true);
    }
  }, [serverErrors._errors]);

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setServerErrors({ _errors: [] });
    setToastErrorOpen(false);
  };

  const handleServerError = (error: string) => {
    setServerErrors({
      _errors: [error],
    });
  };

  const { data: tempOneTimePasswordCode, refetch } =
    useOneTimePasswordCodeQuery(
      {
        reference: oneTimeCodeReference,
        passwordType,
      },
      {
        skip: !oneTimeCodeReference,
      }
    );

  useEffect(() => {
    dispatch(setBillsTranslations(billsTranslations));
    dispatch(setSidebarTranslations(sidebarTranslations));
    dispatch(setProfileTranslations(profileTranslations));
  }, [dispatch, billsTranslations, sidebarTranslations, profileTranslations]);

  const [page, setPage] = useState(0);
  const [date, setDate] = useState<{
    startDate?: Date;
    endDate?: Date;
    key?: string;
  }>({
    key: "selection",
    startDate: undefined,
    endDate: undefined,
  });
  const [modalDate, setModalDate] = useState<{
    startDate?: Date;
    endDate?: Date;
    key?: string;
  }>({
    key: "selection",
    startDate: undefined,
    endDate: undefined,
  });

  const [status, setStatus] = useState(
    billsTranslations?.filterByAccountStatus[0].value
  );
  const [merchantId, setMerchantId] = useState("");
  const [amount, setAmount] = useState([0, 0]);
  const [maxAmount, setMaxAmount] = useState(0);

  useEffect(() => {
    const { query } = router;

    setMerchantId((query?.merchantId as string) || "");
  }, [router]);

  const filtersInitialState = useMemo(
    () => ({
      amount: [0, maxAmount],
      status: billsTranslations?.filterByAccountStatus[0].value,
      merchant: "",
      date: {
        key: "selection",
        startDate: undefined,
        endDate: undefined,
      },
    }),
    [billsTranslations?.filterByAccountStatus, maxAmount]
  );

  const handleStatusChange = useCallback(
    (event: SelectChangeEvent) => setStatus(event.target.value as string),
    []
  );

  const handleMerchantChange = useCallback(
    (event: SelectChangeEvent) => setMerchantId(event.target.value),
    []
  );

  const resetFilters = useCallback(() => {
    setStatus(filtersInitialState.status);
    setAmount(filtersInitialState.amount);
    setDate(filtersInitialState.date);
    setModalDate(filtersInitialState.date);
    setMerchantId(filtersInitialState.merchant);
  }, [
    filtersInitialState.amount,
    filtersInitialState.date,
    filtersInitialState.merchant,
    filtersInitialState.status,
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: currentUser, refetch: update } = useGetCurrentUserQuery(token);
  const { data: merchants } = useGetMerchantsQuery(token);
  const { data: userTransactions } = useGetUserTransactionsQuery(
    {
      token,
      userId: currentUser?.id,
      page,
      startAmount: amount[0],
      endAmount: amount[1],
      status,
      merchantId: merchantId ? +merchantId : undefined,
      startDate: date.startDate ? format(date.startDate, "yyyy-MM-dd") : "",
      endDate: date.endDate ? format(date.endDate, "yyyy-MM-dd") : undefined,
      isInvoice: true,
    },
    { skip: !currentUser?.id || amount[1] < 1 }
  );

  const { data: additionalEmails } = useGetAdditionEmailsQuery(
    {
      userId: currentUser?.id!,
    },
    { skip: !currentUser?.id }
  );

  const {
    data: maxTransactionAmountData,
    isSuccess: fetchedMaxTransactionAmountData,
  } = useGetTransactionsMaxAmountQuery(
    {
      token,
      userId: currentUser?.id,
    },
    { skip: !currentUser?.id }
  );

  useEffect(() => {
    if (
      fetchedMaxTransactionAmountData &&
      maxTransactionAmountData?.content[0]?.amount
    ) {
      setAmount([0, Math.ceil(maxTransactionAmountData?.content[0].amount)]);
      setMaxAmount(Math.ceil(maxTransactionAmountData?.content[0].amount));
    }
  }, [fetchedMaxTransactionAmountData, maxTransactionAmountData?.content]);

  const handleAmountChange = useCallback(
    (event: Event, value: number | number[]) => {
      setAmount(value as number[]);
    },
    []
  );

  const updateUI = () => {
    update();
  };

  const openAddEmailModal = (isOpen: boolean) => {
    setAddOrEditAdditionalEmailModalOpen(isOpen);
  };

  const fetchPDF = async (transaction: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transactions/${transaction?.id}/invoice`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        return { fileName: `transaction-${transaction?.id}`, data: blob };
      }
      console.error(
        "Failed to fetch PDF:",
        response.status,
        response.statusText
      );
    } catch (error) {
      console.error("Error occurred while fetching PDF:", error);
    }
  };

  const fetchPDFOnClick = async () => {
    const promisPdfs: Promise<{ fileName: string; data: Blob } | undefined>[] =
      [];
    try {
      setIsLoadingPdf(true);
      userTransactions?.content.map((bill: any) => {
        promisPdfs.push(fetchPDF(bill));
      });

      Promise.all(promisPdfs).then((pdfs) => {
        const zip = new JSZip();
        pdfs.map((pdf, index) =>
          zip.file(
            `${pdf?.fileName}.pdf` ?? `transaction-${index}.pdf`,
            pdf?.data ?? "no data",
            {
              base64: true,
            }
          )
        );

        zip.generateAsync({ type: "blob" }).then((content) => {
          const url = URL.createObjectURL(content);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = "transactions.zip";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  return (
    <PrivateRoute>
      <h2 className={styles.heading} data-testid="billsHeading">
        {billsTranslations?.yourBills}
      </h2>
      <div className={styles.emailSection}>
        <CardRow>
          <Accordion
            sx={{
              "#panel1a-header": {
                padding: "0 24px 0 0",
              },
            }}
          >
            <AccordionSummary
              sx={{
                ".MuiAccordionSummary-content, .MuiAccordionSummary-content.Mui-expanded":
                  {
                    margin: 0,
                  },
              }}
              expandIcon={<ExpandMoreIcon style={{ color: "#222222" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className={styles.userEmailWrapper}>
                <span className={styles.userEmail}>
                  {currentUser?.email || "No email present"}
                </span>
                <span className={styles.verified}>
                  <VerifiedCard color="#ff8000" />
                </span>
                <span className={styles.allEmailLabel}>
                  Alle E-Mail Addressen anzeigen
                </span>
              </div>
            </AccordionSummary>
            <AccordionDetails style={{ padding: "0 24px 24px 24px" }}>
              <div className={styles.emailList}>
                {additionalEmails?.content.map(({ id, email, confirmed }) => {
                  if (email === currentUser?.email) {
                    return null;
                  }
                  return (
                    <div key={`user-email-${email}`} className={styles.email}>
                      {email}
                    </div>
                  );
                })}
              </div>
            </AccordionDetails>
          </Accordion>
        </CardRow>
      </div>
      <div className={styles.detailsSection}>
        <CardRow>
          <Card>
            <div>
              <AddEmail openAddEmailModal={openAddEmailModal} />
            </div>
          </Card>
          <Card>
            <MonthlyStatement />
          </Card>
          <Card>
            <InterestStatements />
          </Card>
        </CardRow>
        {maxTransactionAmountData?.content[0]?.amount && (
          <Card className={styles.filterCard}>
            <h3 className={styles.filterHeading}>
              {billsTranslations?.specificInvoice}
            </h3>
            <div className={styles.filterContent}>
              <div className={styles.filters}>
                <div>
                  <h5>{billsTranslations?.date}</h5>
                  <div
                    className={styles.inputBlock}
                    data-testid="dateRangePicker"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <div className={styles.calendarIcon}>
                      <CalendarIcon />
                    </div>
                    {date.startDate && date.endDate ? (
                      <div className={styles.dates}>
                        <span>
                          {`
                        ${
                          date.startDate && format(date.startDate, "dd.MM.yyyy")
                        }
                          - 
                          ${
                            date.endDate && format(date.endDate, "dd.MM.yyyy")
                          }`}
                        </span>
                      </div>
                    ) : (
                      <span>{billsTranslations?.selectRange}</span>
                    )}
                  </div>
                </div>
                <div>
                  <h5>{billsTranslations?.amount}</h5>
                  <Slider
                    classes={{
                      rail: styles.sliderRail,
                      root: styles.sliderRoot,
                      valueLabel: styles.sliderValueLabel,
                      thumb: styles.sliderThumb,
                    }}
                    value={amount}
                    min={0}
                    max={Math.ceil(
                      maxTransactionAmountData?.content[0]?.amount
                    )}
                    onChange={handleAmountChange}
                    valueLabelDisplay="on"
                    valueLabelFormat={toFixedAmount}
                    data-testid="sliderFilter"
                  />
                </div>
                <div>
                  <h5>{billsTranslations?.invoiceStatus}</h5>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={status}
                      fullWidth
                      onChange={handleStatusChange}
                      displayEmpty
                      data-testid="tableSelectTransactionType"
                    >
                      {billsTranslations?.filterByAccountStatus.map(
                        (status, index) => (
                          <MenuItem
                            key={`status-${status.value}`}
                            value={status.value}
                          >
                            {status.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <h5>{billsTranslations?.dealer}</h5>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={`${merchantId}`}
                      fullWidth
                      onChange={handleMerchantChange}
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
                {billsTranslations?.clearFilter}
              </Button>
            </div>
          </Card>
        )}
        {userTransactions?.content.length ? (
          <>
            <div className={styles.results}>
              <TableComponent userTransactions={userTransactions?.content} />
              <div className={styles.paginationContainer}>
                <div className={styles.pagination}>
                  <Pagination
                    count={userTransactions.totalPages}
                    page={userTransactions.number + 1}
                    handleChange={setPage}
                    className={styles.paginationBlock}
                  />
                  <div
                    className={clsx(
                      styles.downloadAll,
                      isLoadingPdf && styles.pdfLoading
                    )}
                    onClick={fetchPDFOnClick}
                  >
                    <DownloadTransactionIcon color="white" size={14} />
                    <span>{billsTranslations?.downloadSection}</span>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              className={styles.modalContent}
              noCloseIcon
              isModalOpen={isModalOpen}
              onClose={setIsModalOpen}
            >
              <DateRangePicker
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={[modalDate]}
                direction="horizontal"
                className={styles.datepicker}
                showDateDisplay={false}
                weekdayDisplayFormat="iiiiii"
                staticRanges={[...defaultStaticRanges, ...staticRanges]}
                inputRanges={[]}
                weekStartsOn={1}
                rangeColors={["#F2F2F2"]}
                onChange={(item) => {
                  setModalDate(item.selection);
                }}
              />
              <div className={styles.datepickerInputsBlock}>
                <div className={styles.datepickerInputs}>
                  <div className={styles.inputBlock}>
                    <div className={styles.calendarIcon}>
                      <CalendarIcon />
                    </div>
                    {modalDate.startDate ? (
                      <div className={styles.dates}>
                        <span>
                          {modalDate.startDate &&
                            format(modalDate.startDate, "dd.MM.yyyy")}
                        </span>
                      </div>
                    ) : (
                      <span>Select</span>
                    )}
                  </div>
                  <span>-</span>
                  <div className={styles.inputBlock}>
                    <div className={styles.calendarIcon}>
                      <CalendarIcon />
                    </div>
                    {modalDate.endDate ? (
                      <div className={styles.dates}>
                        <span>
                          {modalDate.endDate &&
                            format(modalDate.endDate, "dd.MM.yyyy")}
                        </span>
                      </div>
                    ) : (
                      <span>Select</span>
                    )}
                  </div>
                </div>
                <div className={styles.datepickerButtons}>
                  <Button
                    width="fit-content"
                    variant="white"
                    onClick={() => {
                      setModalDate(date);
                      setIsModalOpen(false);
                    }}
                  >
                    {t`CANCEL`}
                  </Button>
                  <Button
                    width="fit-content"
                    variant="black"
                    onClick={() => {
                      setDate(modalDate);
                      setIsModalOpen(false);
                    }}
                  >
                    {t`APPLY`}
                  </Button>
                </div>
              </div>
            </Modal>
          </>
        ) : (
          <Card className={styles.noData}>
            <div data-testid="noTableData">
              <CheckIcon color="#ecebeb" />
              <span>
                <Trans>Keine Rechnungen vorhanden</Trans>
              </span>
            </div>
            <p className={styles.paragraph}>
              <Trans>
                Vergewissern Sie sich, dass Sie die E-Mail-Adresse und die
                Karten, von denen Sie die Rechnungen sehen möchten, hinzugefügt
                haben.
              </Trans>
            </p>
          </Card>
        )}
      </div>
      <Modal
        isModalOpen={isAddOrEditAdditionalEmailModalOpen}
        onClose={setAddOrEditAdditionalEmailModalOpen}
      >
        <AddOrEditAdditionalEmailModal
          translations={profileTranslations}
          isOpen={isAddOrEditAdditionalEmailModalOpen}
          onClose={setAddOrEditAdditionalEmailModalOpen}
          handleServerError={handleServerError}
          showAddEmailConfirmation={setAddEmailConfirmationModalOpen}
          setCurrAdditionEmail={setCurrAdditionEmail}
          currAdditionEmail={currAdditionEmail}
          updateUI={updateUI}
          additionalsEmails={additionalEmails?.content}
          isEditCurrEmail={isEditCurrEmail}
          setEditCurrEmail={setEditCurrEmail}
          user={currentUser!}
        />
      </Modal>
      <Modal
        isModalOpen={isAddEmailConfirmationModalOpen}
        onClose={setAddEmailConfirmationModalOpen}
      >
        {isAddEmailConfirmationModalOpen && (
          <AddEmailConfirmationModal
            onClose={setAddEmailConfirmationModalOpen}
            handleServerError={handleServerError}
            showEditEmailModal={setAddOrEditAdditionalEmailModalOpen}
            setCurrAdditionEmail={setCurrAdditionEmail}
            updateUI={updateUI}
            currAdditionEmail={currAdditionEmail}
            isEditCurrEmail={isEditCurrEmail}
            setEditCurrEmail={setEditCurrEmail}
            setOneTimeCodeReference={setOneTimeCodeReference}
            refetchOneTimeCode={refetch}
          />
        )}
      </Modal>

      <ToastError
        message={serverErrors._errors.join(", ")}
        duration={6000}
        open={isToastErrorOpen}
        handleClose={handleCloseToast}
      />
      {tempOneTimePasswordCode?.code && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Your code is: {tempOneTimePasswordCode?.code}
          </Alert>
        </Snackbar>
      )}
    </PrivateRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=10000"
  );

  const [translation, data, profileData, sidebar] = await Promise.all([
    getTranslation(ctx),
    getStrapiTranslations(`bills-page?locale=${ctx.locale}`),
    getStrapiTranslations(`setting-account?locale=${ctx.locale}`),
    getStrapiSidebarTranslations(ctx.locale),
  ]);

  return {
    props: {
      translation,
      billsTranslations: data,
      sidebarTranslations: sidebar,
      profileTranslations: profileData,
    },
  };
};

export default BillsPage;
