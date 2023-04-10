import { type AppType } from "next/app";
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from "@material-tailwind/react";
import { api } from "~/utils/api";
import { MantineProvider } from "@mantine/core";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <ClerkProvider {...pageProps} >
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: 'dark',
                }}
            >
                <ThemeProvider>
                    <Component {...pageProps} />
                </ThemeProvider>
            </MantineProvider>
        </ClerkProvider>
      );
};

export default api.withTRPC(MyApp);
