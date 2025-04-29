import { FC, PropsWithChildren } from "react";

import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
