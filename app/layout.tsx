import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import '@mantine/dropzone/styles.css';

import type { Metadata } from "next";
import { Layout } from "./components";
import "./globals.css";
import Providers from "./providers";

// Import OuraRingOAuth component
import OuraRingOAuth from "./components/OuraRingOAuth";

export const metadata: Metadata = {
  title: "YOUR DATA DAO",
  description:
    "Join with your data and receive governance rights. Vote to sell the data to AI companies, or vote to delete it if the data provider open sources their models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          <Layout>
            {/* Add OuraRingOAuth component here */}
            <OuraRingOAuth />
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
