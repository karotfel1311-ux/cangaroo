import type { Metadata } from "next";
import { PropsWithChildren, Suspense } from "react";
import "@mantine/core/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ToastProvider } from "../providers/ToastProvider";

export const metadata: Metadata = {
  title: "CANGAROO",
  description: "Cangaroo shop",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body style={{ overflow: "hidden" }}>
        <ReactQueryProvider>
          <MantineProvider>
            <ToastProvider>
              <Suspense>{children}</Suspense>
            </ToastProvider>
          </MantineProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
