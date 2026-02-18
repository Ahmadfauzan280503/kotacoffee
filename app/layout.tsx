import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import Script from "next/script";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { getSession } from "@/lib/auth";
import LayoutWrapper from "@/components/layout-wrapper";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/images/logo-kotacoffee.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html suppressHydrationWarning lang="id">
      <head />
      <body
        className={clsx(
          "text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers
          session={session}
          themeProps={{ attribute: "class", defaultTheme: "light" }}
        >
          <div className="relative flex flex-col h-screen">
            <LayoutWrapper>{children}</LayoutWrapper>
          </div>
        </Providers>
        <Script
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
