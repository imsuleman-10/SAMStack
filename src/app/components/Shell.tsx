"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { type ReactNode } from "react";

const HIDE_NAV_PATHS = [/^\/blog\/.+$/, /^\/services\/.+$/];

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNav = HIDE_NAV_PATHS.some((re) => re.test(pathname));

  return (
    <>
      {!hideNav && <Header />}
      <main className={`${hideNav ? "" : "flex-grow"} flex flex-col relative z-10`}>{children}</main>
      {!hideNav && <Footer />}
    </>
  );
}
