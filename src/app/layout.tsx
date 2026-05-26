import type { Metadata } from "next";
import "../../src/index.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "CloudPulse",
  description: "AI-powered multi-cloud incident monitoring dashboard.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}