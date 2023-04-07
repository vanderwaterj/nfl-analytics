import { type AppType } from "next/app";
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from "@material-tailwind/react";
import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <ClerkProvider {...pageProps} >
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
        </ClerkProvider>
      );
};

export default api.withTRPC(MyApp);
