import { useGetCardAccountTransactionsQuery } from "@/redux/User/Accounts/account-slice";
import { useAppSelector } from "@/redux/store";
import { format, startOfMonth, subDays, subMonths } from "date-fns";
import { useCallback, useEffect, useState } from "react";

const today = new Date();

const months = Array.from({ length: 7 }, (_, i) => subMonths(today, i));
export const monthNames = months.map((month) => format(month, "MMM")).reverse();

const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, i));
export const dayNames = last7Days.map((date) => format(date, "EEE")).reverse();

export const useGetGraphData = (id: number | undefined) => {
  const token = useAppSelector((state) => state.user.token);
  const [monthSelected, setMonthSelected] = useState(true);

  const [values, setValues] = useState([0, 0, 0, 0, 0, 0, 0]);

  const { data: cardAccountTransactions } = useGetCardAccountTransactionsQuery(
    {
      token,
      cardAccountId: id,
      amount: 10000,
      endDate: format(new Date(), "yyyy-MM-dd"),
      startDate: monthSelected
        ? format(startOfMonth(subMonths(new Date(), 7)), "yyyy-MM-dd")
        : format(startOfMonth(subDays(new Date(), 7)), "yyyy-MM-dd"),
    },
    { skip: !id }
  );

  const calculateValues = useCallback(() => {
    const newValues = [0, 0, 0, 0, 0, 0, 0];

    cardAccountTransactions?.content.forEach((transaction) => {
      const date = new Date(transaction.creationDate);
      const index = monthSelected
        ? months.findIndex(
            (month) => format(month, "MMM") === format(date, "MMM")
          )
        : last7Days.findIndex(
            (day) => format(day, "EEE") === format(date, "EEE")
          );

      if (index !== -1) {
        newValues[index] += transaction.amount;
      }
    });

    setValues(newValues);
  }, [cardAccountTransactions?.content, monthSelected]);

  useEffect(() => {
    setValues([0, 0, 0, 0, 0, 0, 0]);
    calculateValues();
  }, [calculateValues, id]);

  const maxValue = Math.max(...values);

  return {
    monthSelected,
    setMonthSelected,
    values,
    maxValue,
  };
};
