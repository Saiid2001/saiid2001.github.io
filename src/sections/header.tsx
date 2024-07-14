import React from "react";
import { IconAndTextButton } from "../components/button";
import constants from "../utils/constants";
import { graphql, useStaticQuery } from "gatsby";
import { Drawer } from "../components/drawer";
import { TopicHeading } from "../components/heading";

export const ThemeToggle: React.FC<{
  theme: string | undefined;

  onToggleTheme: (theme: string) => void;
}> = (props) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const Icon =
    props.theme === "light" ? constants.ICONS.SUN : constants.ICONS.MOON;

  return (
    <div className="relative pointer-events-auto flex items-center">
      <input
        type="checkbox"
        className={
          "toggle toggle-lg   " +
          (props.theme === "light"
            ? "border-secondary bg-secondary"
            : "border-primary-light bg-primary-light")
        }
        checked={props.theme === "dark"}
        onClick={() =>
          props.onToggleTheme(props.theme === "light" ? "dark" : "light")
        }
        ref={inputRef}
      />
      <span
        className={
          " absolute top-0 bottom-0 right-0 w-1/2 h-full toggle-icon flex items-center justify-center cursor-pointer" +
          (props.theme === "light" ? " toggle-icon-checked" : "")
        }
        onClick={() => inputRef.current?.click()}
      >
        <Icon />
      </span>
    </div>
  );
};

export const CVDownloadButton: React.FC<{
  accent?: boolean;
}> = ({ accent }) => {
  const { file } = useStaticQuery(graphql`
    query CVQuery {
      file(relativePath: { eq: "cv.pdf" }) {
        publicURL
      }
    }
  `);

  const aRef = React.useRef<HTMLAnchorElement>(null);

  return (
    <IconAndTextButton
      icon={constants.ICONS.DOWN_ARROW}
      onClick={() => aRef.current?.click()}
      accent={accent}
    >
      CV / Résumé
      <a href={file?.publicURL} download className="hidden" ref={aRef} />
    </IconAndTextButton>
  );
};

export const Navigation: React.FC<{ scrolled: boolean; vertical?: boolean }> = ({
  scrolled,
  vertical,
}) => {
  return (
    <nav
      className={
        "flex gap-x-4  pointer-events-auto " +
        (vertical ? "flex-col gap-y-4" : "")
      }
    >
      <a
        href="/publications/"
        className={
          "text-base-content font-light hover:underline " +
          (scrolled ? "hover:text-base-100" : "hover:text-secondary")
        }
      >
        publications
      </a>
      <a
        href="/projects/"
        className={
          "text-base-content font-light hover:underline " +
          (scrolled ? "hover:text-base-100" : "hover:text-secondary")
        }
      >
        projects
      </a>
      <a
        href="/blog/"
        className={
          "text-base-content font-light hover:underline " +
          (scrolled ? "hover:text-base-100" : "hover:text-secondary")
        }
      >
        blog
      </a>
    </nav>
  );
};

const Header: React.FC<{
  theme: string;
  hideOnScroll?: boolean;
  onToggleTheme: (theme: string) => void;
}> = (props) => {
  // get the scroll y position
  const [scrollY, setScrollY] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrolled = scrollY > constants.SCROLL_START_THRESHOLD;

  return (
    <>
      <header
        className={
          "fixed top-0 w-full left-0 z-30 " + (scrolled ? "bg-secondary" : "")
        }
      >
        <div
          className={
            "py-4 pl-32 px-8 flex justify-between items-center w-[100rem] max-w-full mx-auto max-md:pl-8 max-md:hidden"
          }
        >
          <span>
            <a href="/" className="text-base-content font-light">
              saiid.ch
            </a>
          </span>

          <Navigation scrolled={scrolled} />

          <span className="flex gap-x-4">
            <CVDownloadButton accent={scrolled} />
            <ThemeToggle
              theme={props.theme}
              onToggleTheme={props.onToggleTheme}
            />
          </span>
        </div>

        <div className=" w-full hidden max-md:flex p-8 justify-between">
        <button
          
          onClick={() => setDrawerOpen(true)}
        >
          <constants.ICONS.MENU
            className="w-6 h-6"
            style={props.theme == "dark" ? { filter: "invert(1)" } : {}}
          />
        </button>
        < a href="/" className="text-base-content font-light">
          saiid.ch
        </a>
        </div>
      </header>
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="flex flex-col justify-between h-full  items-start gap-y-4">
          <a href="/" className="text-base-content font-light">
            saiid.ch
          </a>
          <div className="flex gap-x-4">
            <CVDownloadButton />
            <ThemeToggle
              theme={props.theme}
              onToggleTheme={props.onToggleTheme}
            />
          </div>
          <TopicHeading name="Navigation" />
          <Navigation scrolled={scrolled} vertical />
        </div>
      </Drawer>
    </>
  );
};

export default Header;
