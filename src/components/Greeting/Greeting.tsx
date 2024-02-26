import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";
import React, { useMemo } from "react";
import { useAppSelector } from "@/redux/store";
import styles from "./Greeting.module.scss";

type GreetingProps = {
  token: string;
};

const Greeting = ({ token }: GreetingProps) => {
  const { data } = useGetCurrentUserQuery(token);
  const { dashboardTranslations } = useAppSelector(
    (state) => state.translations
  );

  const { firstName, name } = data ?? {};

  const greetingMessage = useMemo(() => {
    let greeting = dashboardTranslations?.mainHeading;

    if (firstName) {
      greeting += `, ${firstName}`;
    }

    if (name) {
      greeting += firstName ? ` ${name}` : `, ${name}`;
    }

    return greeting;
  }, [dashboardTranslations?.mainHeading, firstName, name]);

  return (
    <h2 className={styles.greeting} data-testid="greetingMessage">
      {greetingMessage}
    </h2>
  );
};

export default Greeting;
