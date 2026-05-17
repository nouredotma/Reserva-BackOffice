import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reserva-app.com"),
  title: {
    default: "Reserva Backoffice",
    template: "%s | Reserva Backoffice",
  },
  description: "Back office Reserva pour la gestion des reservations, clients, paiements et operations.",
  icons: {
    icon: "/Images/logos/logo.png",
    shortcut: "/Images/logos/logo.png",
    apple: "/Images/logos/logo.png",
  },
};

export const viewport = {
  themeColor: "#FFC900",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${figtree.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
