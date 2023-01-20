import { ChakraProvider } from '@chakra-ui/react';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { NextPage } from 'next';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { ReactElement, ReactNode, useEffect } from 'react';

import nextI18NextConfig from '../../next-i18next.config';
import GlobalModalsLayout from '../components/layouts/GlobalModalsLayout';
import NavbarLayout from '../components/layouts/NavbarLayout';
import '../lib/firebase';
import { firebaseApp } from '../lib/firebase';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <NavbarLayout>{page}</NavbarLayout>);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaV3Provider(
        process.env.NEXT_PUBLIC_CAPTCHA_SITE_ID as string
      ),

      isTokenAutoRefreshEnabled: true,
    });
  }, []);

  return (
    <ChakraProvider>
      <GlobalModalsLayout>
        {getLayout(<Component {...pageProps} />)}
      </GlobalModalsLayout>
    </ChakraProvider>
  );
};

export default appWithTranslation(App, nextI18NextConfig);
