import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "@/redux/store";
import { compareAsc } from "date-fns";
import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";

interface IProps {
  children?: ReactNode;
  redirectTo?: string;
  restricted: boolean;
}

export const PublicRoute: React.FC<IProps> = ({
  children,
  redirectTo = "/",
  restricted = false,
}) => {
  const token = useAppSelector((state) => state.user.token);
  const EXPIRIES_AT = useAppSelector((state) => state.user.expires_at);
  const valid = compareAsc(new Date(), new Date(EXPIRIES_AT));
  const shouldRedirect = token && valid === -1 && restricted;
  const router = useRouter();
  const { data: user } = useGetCurrentUserQuery(token);

  useEffect(() => {
    if (
      user?.language &&
      valid &&
      router.locale !== user?.language?.toLowerCase()
    ) {
      router.push(router.pathname, router.pathname, {
        locale: user?.language?.toLowerCase(),
      });
    }
  }, [router, user, valid]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push(redirectTo);
    }
  }, [redirectTo, router, shouldRedirect]);

  return shouldRedirect ? null : <>{children}</>;
};
