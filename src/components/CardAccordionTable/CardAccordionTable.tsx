import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SelectChangeEvent,
  Slider,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { format } from "date-fns";
import { debounce } from "lodash";
import { staticRanges } from "@/pages/bills";
import { Trans, t } from "@lingui/macro";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import {
  useGetCardAccountTransactionsMaxAmountQuery,
  useGetCardAccountTransactionsQuery,
} from "@/redux/User/Accounts/account-slice";
import { useAppSelector } from "@/redux/store";
import { toFixedAmount } from "@/utils";
import styles from "./CardAccordionTable.module.scss";
import { CalendarIcon } from "../Icons/CalendarIcon/CalendarIcon";
import { InboxTableComponent } from "../InboxTable/Table";
import { Button } from "../common/Button/Button";
import { CardTable } from "./Table/Table";
import { Modal } from "../common/Modal/Modal";
import { Portal } from "../Portal/Portal";
import { Pagination } from "../Pagination/Pagination";
import Card from "../common/Card/Card";
import { CheckIcon } from "../Icons/CheckIcon/CheckIcon";

const CardAccordionTable = ({
  cardId,
  expanded,
}: {
  cardId?: number;
  expanded: boolean;
}) => {
  const token = useAppSelector((state) => state.user.token);

  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState([0, 0]);
  const [maxAmount, setMaxAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portalModalVisible, setPortalModalVisible] = useState(false);

  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);

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
  const [page, setPage] = useState(0);

  const {
    data: maxTransactionAmountData,
    isSuccess: fetchedMaxTransactionAmountData,
  } = useGetCardAccountTransactionsMaxAmountQuery(
    {
      token,
      cardAccountId: cardId,
    },
    { skip: !cardId || !expanded }
  );

  useEffect(() => {
    if (
      fetchedMaxTransactionAmountData &&
      maxTransactionAmountData?.content.length &&
      maxTransactionAmountData?.content[0].amount
    ) {
      setAmount([0, Math.ceil(maxTransactionAmountData?.content[0].amount)]);
      setMaxAmount(Math.ceil(maxTransactionAmountData?.content[0].amount));
    }
  }, [fetchedMaxTransactionAmountData, maxTransactionAmountData?.content]);

  const { data: cardAccountTransactions } = useGetCardAccountTransactionsQuery(
    {
      token,
      page,
      cardAccountId: cardId,
      startAmount: amount[0],
      endAmount: amount[1],
      startDate: date.startDate ? format(date.startDate, "yyyy-MM-dd") : "",
      endDate: date.endDate ? format(date.endDate, "yyyy-MM-dd") : undefined,
      status,
    },
    { skip: !cardId || !expanded }
  );

  const handleAmountChange = useCallback(
    (event: Event, value: number | number[]) => {
      setAmount(value as number[]);
      setPage(0);
    },
    []
  );

  const handleStatusChange = useCallback((event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
    setPage(0);
  }, []);

  const filtersInitialState = useMemo(
    () => ({
      amount: [0, maxAmount],
      status: "",
      merchant: "",
      date: {
        key: "selection",
        startDate: undefined,
        endDate: undefined,
      },
    }),
    [maxAmount]
  );

  const resetFilters = useCallback(() => {
    setStatus(filtersInitialState.status);
    setAmount(filtersInitialState.amount);
    setDate(filtersInitialState.date);
    setPage(0);
    setModalDate(filtersInitialState.date);
  }, [
    filtersInitialState.amount,
    filtersInitialState.date,
    filtersInitialState.status,
    setDate,
    setModalDate,
  ]);
  return (
    <>
      <div className={styles.filterCard}>
        <div className={styles.filterContent}>
          <div className={styles.filters}>
            <div>
              <h5>Datum</h5>
              <div
                className={styles.inputBlock}
                data-testid="dateRangePicker"
                onClick={() => {
                  setIsModalOpen(true);
                  setPortalModalVisible(true);
                }}
              >
                <div className={styles.calendarIcon}>
                  <CalendarIcon />
                </div>
                {date.startDate && date.endDate ? (
                  <div className={styles.dates}>
                    <span>
                      {`
            ${date.startDate && format(date.startDate, "dd.MM.yyyy")}
              - 
              ${date.endDate && format(date.endDate, "dd.MM.yyyy")}`}
                    </span>
                  </div>
                ) : (
                  <span>Range</span>
                )}
              </div>
            </div>
            <div>
              <h5>Betrag</h5>
              <Slider
                classes={{
                  rail: styles.sliderRail,
                  root: styles.sliderRoot,
                  valueLabel: styles.sliderValueLabel,
                  thumb: styles.sliderThumb,
                }}
                value={amount}
                min={0}
                max={maxAmount}
                onChange={debounce(handleAmountChange)}
                valueLabelDisplay="on"
                valueLabelFormat={toFixedAmount}
                data-testid="sliderFilter"
              />
            </div>
            <div>
              <h5>Invoice status</h5>
              <FormControl size="small" fullWidth>
                <Select
                  value={status}
                  fullWidth
                  onChange={handleStatusChange}
                  displayEmpty
                  data-testid="tableSelectTransactionType"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="UNKNOWN">Unknown</MenuItem>
                  <MenuItem value="PARTIAL">Partial</MenuItem>
                  <MenuItem value="FULL">Full</MenuItem>
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
            clear filter
          </Button>
        </div>
      </div>
      {cardAccountTransactions?.content.length ? (
        <>
          <CardTable data={cardAccountTransactions.content} />
          <div className={styles.paginationContainer}>
            <div className={styles.pagination}>
              <Pagination
                count={cardAccountTransactions.totalPages}
                page={cardAccountTransactions.number + 1}
                handleChange={setPage}
                className={styles.paginationBlock}
              />
            </div>
          </div>
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
              Vergewissern Sie sich, dass Sie die E-Mail-Adresse und die Karten,
              von denen Sie die Rechnungen sehen möchten, hinzugefügt haben.
            </Trans>
          </p>
        </Card>
      )}
      {portalModalVisible && (
        <Portal handlePortalNode={setPortalNode}>
          {portalNode && (
            <Modal
              className={styles.modalContent}
              noCloseIcon
              isModalOpen={isModalOpen}
              onClose={setIsModalOpen}
              setPortalActive={() => setPortalModalVisible(false)}
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
                      setPage(0);
                      setIsModalOpen(false);
                    }}
                  >
                    {t`APPLY`}
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </Portal>
      )}
    </>
  );
};

export default CardAccordionTable;
