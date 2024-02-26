import React, { ReactElement, useEffect, useState } from "react";
import { OnboardingMenu } from "@/components/OnboardingMenu/OnboardingMenu";
import { OnboardingLayout } from "@/layouts/OnboardingLayout/OnboardingLayout";
import { Registration } from "@/components/OnboardingSteps/Registration/Registration";
import { Login } from "@/components/OnboardingSteps/Login/Login";
import { PublicRoute } from "@/components/Routes/PublicRoute";
import { IOnboardingMenu } from "@/components/OnboardingMenu/IOnboardingMenu";
import {
  getStrapiSidebarTranslations,
  getStrapiTranslations,
  getTranslation,
} from "@/utils";
import { GetServerSideProps } from "next/types";
import { IOnboardingTranslations, ISidebarTranslations } from "@/utility/types";
import { useAppDispatch } from "@/redux/store";
import {
  setOnboardingTranslations,
  setSidebarTranslations,
} from "@/redux/Strapi/strapi-slice";

interface IOnboardingProps {
  onboardingTranslations: IOnboardingTranslations;
  sidebarTranslations: ISidebarTranslations;
}

const menu: IOnboardingMenu = {
  MENU_REGISTRATION: "menu_registration",
  MENU_LOGIN: "menu_login",
};

const Onboarding = ({
  onboardingTranslations,
  sidebarTranslations,
}: IOnboardingProps) => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [step, setStep] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const handleChangeMenu = (menuItem: string) => setSelectedMenu(menuItem);
  const handleChangeStep = (step: string) => setStep(step);

  useEffect(() => {
    dispatch(setOnboardingTranslations(onboardingTranslations));
    dispatch(setSidebarTranslations(sidebarTranslations));
  }, [dispatch, onboardingTranslations, sidebarTranslations]);

  return (
    <PublicRoute restricted>
      <OnboardingLayout step={step}>
        {!selectedMenu && (
          <OnboardingMenu handleChangeMenu={handleChangeMenu} menu={menu} />
        )}
        {selectedMenu === menu.MENU_REGISTRATION && (
          <Registration
            handleChangeMenu={handleChangeMenu}
            menu={menu}
            handleChangeStep={handleChangeStep}
          />
        )}
        {selectedMenu === menu.MENU_LOGIN && (
          <Login
            handleChangeMenu={handleChangeMenu}
            menu={menu}
            handleChangeStep={handleChangeStep}
          />
        )}
      </OnboardingLayout>
    </PublicRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=10000"
  );

  const [translation, data, sidebar] = await Promise.all([
    getTranslation(ctx),
    getStrapiTranslations(`onboarding?locale=${ctx.locale}`),
    getStrapiSidebarTranslations(ctx.locale),
  ]);

  return {
    props: {
      translation,
      onboardingTranslations: data,
      sidebarTranslations: sidebar,
    },
  };
};

export default Onboarding;

Onboarding.getLayout = (page: ReactElement) => page;
