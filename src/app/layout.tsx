import { Plus_Jakarta_Sans } from "next/font/google";
import { buildMetadata } from "@/lib/metadata";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = buildMetadata(
  "DAC Accounting | Professional Accounting Services",
  "DAC Accounting provides professional accounting and financial support designed to help businesses stay organized, informed and ready for what comes next."
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
