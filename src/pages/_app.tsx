import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "../styles/sass/main.scss";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { NextPage } from "next";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { EmotionCache } from "@emotion/cache";
import { deDE, enUS, Localization } from "@mui/material/locale";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { initTranslation } from "@/utils";
import { Loading } from "@/components/Loading/Loading";
import createEmotionCache from "../utility/createEmotionCache";
import lightThemeOptions from "../styles/theme/lightThemeOptions";
import { store, persistor } from "../redux/store";

initTranslation(i18n);

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type PageProps = JSX.IntrinsicAttributes & {
  translation: any;
};

type AppPropsWithLayout = AppProps<PageProps> & {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
};

const clientSideEmotionCache = createEmotionCache();

const App = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: AppPropsWithLayout) => {
  const router = useRouter();
  const locale = router.locale || router.defaultLocale || "de";
  const firstRender = useRef(true);
  const materialUiLocale = locale === "de" ? deDE : enUS;
  const [loading, setLoading] = useState(true);

  useEffect(() => setLoading(false), []);

  if (pageProps.translation && firstRender.current) {
    // load the translations for the locale
    i18n.load(locale, pageProps.translation);
    i18n.activate(locale);
    // render only once
    firstRender.current = false;
  }

  useEffect(() => {
    if (pageProps.translation) {
      i18n.load(locale, pageProps.translation);
      i18n.activate(locale);
    }
  }, [locale, pageProps.translation]);

  const themeWithLocale = useMemo(
    () => createTheme(lightThemeOptions, materialUiLocale),
    [materialUiLocale]
  );

  const renderWithLayout =
    Component.getLayout ||
    function renderMain(page) {
      return <MainLayout>{page}</MainLayout>;
    };

  return (
    <I18nProvider i18n={i18n}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CacheProvider value={emotionCache}>
            <ThemeProvider theme={themeWithLocale}>
              <CssBaseline />
              {loading ? (
                <Loading />
              ) : (
                renderWithLayout(<Component {...pageProps} />)
              )}
            </ThemeProvider>
          </CacheProvider>
        </PersistGate>
      </Provider>
    </I18nProvider>
  );
};

export default App;
