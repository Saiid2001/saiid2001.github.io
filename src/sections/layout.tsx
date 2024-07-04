import * as React from "react";
import type { PageProps } from "gatsby";
import Header from "./header";
import Footer from "./footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = (props) => {
  // get default system theme
  const [theme, setTheme] = React.useState("light");

  React.useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    // get theme from local storage
    const localTheme = localStorage.getItem("theme");

    setTheme(localTheme || systemTheme || "light");
  }, []);

  // set theme to local storage and html attribute
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
    <link href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400..900&family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"/>
    <main className="w-[100rem] max-w-full mx-auto bg-base-100">
      <Header theme={theme} onToggleTheme={setTheme} />
      <div>{props.children}</div>
      <Footer currPath=""/>
    </main>
    </>
  );
};

export default Layout;
