import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Duplicates NFT",
  description: "NFT minting and management platform for creating duplicates of existing NFTs",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout(props: {children: ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
