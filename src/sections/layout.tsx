import * as React from "react";
import type { PageProps } from "gatsby";
import Header from "./header";
import Footer from "./footer";

type LayoutProps = {
  hideHeaderOnScroll?: boolean;
  children: React.ReactNode;
  theme?: string;
  noMargin?: boolean;
  onToggleTheme?: (theme: string) => void;
};

const BackToTopButton: React.FC = () => {

  const [showButton, setShowButton] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window?.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 right-5 p-2 rounded-full bg-base-100 text-secondary z-50 ${
        showButton ? "block" : "hidden"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}

const Layout: React.FC<LayoutProps> = (props) => {
  // get default system theme
  const [theme, setTheme] = React.useState(props.theme || "light");
  const [fetchedLocalTheme, setFetchedLocalTheme] = React.useState(false);

  React.useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    // get theme from local storage
    const localTheme = localStorage.getItem("theme");

    setFetchedLocalTheme(true);
    setTheme(localTheme || systemTheme || "light");
  }, []);

  function changeTheme(theme: string) {
    if (!fetchedLocalTheme) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    props.onToggleTheme?.(theme);
  }

  // set theme to local storage and html attribute
  React.useEffect(() => {
    changeTheme(theme);
  }, [theme, fetchedLocalTheme]);

  React.useEffect(() => {
    if (props.theme  && props.theme !== theme) {
      setTheme(props.theme);
    }
  }, [props.theme]);



  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400..900&family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />
      <main className={"mx-auto bg-base-100 "+ (!props.noMargin? "w-[100rem] max-w-full":"w-full")} >
        <Header
          theme={theme}
          onToggleTheme={setTheme}
          hideOnScroll={props.hideHeaderOnScroll}
        />
        <div>{props.children}</div>
        <Footer currPath="" />
        <BackToTopButton />
      </main>
    </>
  );
};

export default Layout;
