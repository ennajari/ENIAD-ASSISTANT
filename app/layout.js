import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Eniad-Assistant",
  description: "AI Assistant",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <html lang="en" suppressHydrationWarning={true}>
          <body className={`${inter.className} antialiased`}>
            <Toaster toastOptions={
              {
                success: {style: { background: "black", color: "white"}},
                error: {style: { background: "black", color: "white"}}
              }
            }/>
            {children}</body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
