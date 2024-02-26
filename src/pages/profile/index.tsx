import React, { useEffect, useMemo } from "react";
import { PrivateRoute } from "@/components/Routes/PrivateRoute";
import {
  getStrapiSidebarTranslations,
  getStrapiTranslations,
  getTranslation,
} from "@/utils";
import { GetServerSideProps } from "next";
import { t } from "@lingui/macro";
import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { UserAvatar } from "@/components/Icons/UserAvatar/UserAvatar";
import { SectionTitle } from "@/components/common/SectionTitle/SectionTitle";
import { PencilIcon } from "@/components/Icons/PencilIcon/PencilIcon";
import { useMediaQuery } from "@mui/material";
import { MobileMenu } from "@/components/Settings/Menu/mobile/MobileMenu/MobileMenu";
import { DesktopMenu } from "@/components/Settings/Menu/desktop/DesktopMenu/DesktopMenu";
import { IGender } from "@/redux/User/Profile/types/IProfile";
import {
  IOnboardingTranslations,
  IProfileTranslations,
  ISidebarTranslations,
} from "@/utility/types";
import {
  setOnboardingTranslations,
  setProfileTranslations,
  setSidebarTranslations,
} from "@/redux/Strapi/strapi-slice";
import styles from "./Profile.module.scss";

export interface ITab {
  id: number;
  name: string;
}

interface IProfileProps {
  profileTranslations: IProfileTranslations;
  sidebarTranslations: ISidebarTranslations;
  onboardingTranslations: IOnboardingTranslations;
}

const Profile = ({
  profileTranslations,
  sidebarTranslations,
  onboardingTranslations,
}: IProfileProps) => {
  const token = useAppSelector((state) => state.user.token);

  const { data: user, refetch } = useGetCurrentUserQuery(token);
  const matches = useMediaQuery("(min-width:1200px)");
  const dispatch = useAppDispatch();

  const tabs: ITab[] = useMemo(
    () => [
      {
        id: 1,
        name: profileTranslations?.contactDetails,
      },
      {
        id: 2,
        name: profileTranslations?.language,
      },
      {
        id: 3,
        name: profileTranslations?.forgotPassowrd,
      },
      {
        id: 4,
        name: profileTranslations?.twoFA,
      },
      {
        id: 5,
        name: profileTranslations?.notifications,
      },
      {
        id: 6,
        name: profileTranslations?.disablePortalAccess,
      },
    ],
    [
      profileTranslations?.contactDetails,
      profileTranslations?.disablePortalAccess,
      profileTranslations?.forgotPassowrd,
      profileTranslations?.language,
      profileTranslations?.notifications,
      profileTranslations?.twoFA,
    ]
  );

  useEffect(() => {
    dispatch(setProfileTranslations(profileTranslations));
    dispatch(setSidebarTranslations(sidebarTranslations));
    dispatch(setOnboardingTranslations(onboardingTranslations));
  }, [
    dispatch,
    profileTranslations,
    sidebarTranslations,
    onboardingTranslations,
  ]);

  const updateUI = () => {
    refetch();
  };

  const getSalutation = (gender: IGender) =>
    gender === "M" ? t`Herr` : t`Frau`;

  if (!user) {
    return null;
  }

  return (
    <PrivateRoute>
      <div className={styles.container}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {/* {user.avatar || <UserAvatar />} */}
            <UserAvatar />
            <div className={styles.editAvatar}>
              <PencilIcon />
            </div>
          </div>
          <div className={styles.userFullName}>
            <SectionTitle>
              {profileTranslations?.emailAddrYourProfile}
            </SectionTitle>
            <div className={styles.userName}>
              {getSalutation(user?.gender as IGender)} {user?.firstName}{" "}
              {user?.name}
              <div className={styles.language}>
                {user?.language?.toLowerCase()}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.settings}>
          {matches ? (
            <DesktopMenu tabs={tabs} user={user!} updateUI={updateUI} />
          ) : (
            <MobileMenu tabs={tabs} user={user!} updateUI={updateUI} />
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

  const [translation, data, onboardingData, sidebar] = await Promise.all([
    getTranslation(ctx),
    getStrapiTranslations(`setting-account?locale=${ctx.locale}`),
    getStrapiTranslations(`onboarding?locale=${ctx.locale}`),
    getStrapiSidebarTranslations(ctx.locale),
  ]);

  return {
    props: {
      translation,
      profileTranslations: data,
      sidebarTranslations: sidebar,
      onboardingTranslations: onboardingData,
    },
  };
};

export default Profile;
