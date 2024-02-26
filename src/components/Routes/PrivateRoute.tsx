import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { compareAsc } from "date-fns";
import { token } from "@/redux/Auth/auth-actions";
import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";

interface IProps {
  children?: ReactNode;
  redirectTo?: string;
}

export const PrivateRoute: React.FC<IProps> = ({
  children,
  redirectTo = "/onboarding",
}) => {
  const accessToken = useAppSelector((state) => state.user.token);
  const { data: user } = useGetCurrentUserQuery(accessToken);
  const EXPIRIES_AT = useAppSelector((state) => state.user.expires_at);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const valid = compareAsc(new Date(), new Date(EXPIRIES_AT));
  const shouldRedirect = !accessToken || valid !== -1;

  useEffect(() => {
    if (
      user &&
      user?.language &&
      router.locale !== user?.language?.toLowerCase()
    ) {
      router.push(router.asPath, router.asPath, {
        locale: user?.language?.toLowerCase(),
      });
    }
  }, [router, user]);

  useEffect(() => {
    if (shouldRedirect) {
      dispatch(token("", ""));
      router.push(redirectTo);
    }
  }, [accessToken, valid, redirectTo, router]);

  return accessToken && valid === -1 ? <>{children}</> : null;
};
