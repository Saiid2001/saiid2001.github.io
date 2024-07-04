import React from "react";
import { IconAndTextButton } from "../components/button";
import constants from "../utils/constants";
import { graphql, useStaticQuery } from "gatsby";

const ThemeToggle: React.FC<{
  theme: string;
  onToggleTheme: (theme: string) => void;
}> = (props) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const Icon =
    props.theme === "light" ? constants.ICONS.SUN : constants.ICONS.MOON;

  return (
    <div className="relative">
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
          " absolute top-0 bottom-0 right-0 w-1/2 h-[85%] toggle-icon flex items-center justify-center cursor-pointer" +
          (props.theme === "light" ? " toggle-icon-checked" : "")
        }
        onClick={() => inputRef.current?.click()}
      >
        <Icon />
      </span>
    </div>
  );
};

const CVDownloadButton: React.FC = () => {
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
    >
      CV / Résumé
      <a href={file?.publicURL} download className="hidden" ref={aRef} />
    </IconAndTextButton>
  );
};

const Header: React.FC<{
  theme: string;
  onToggleTheme: (theme: string) => void;
}> = (props) => {
  return (
    <header className="  fixed top-0 w-full left-0 z-30">
      <div className="py-4 pl-32 px-8 flex justify-between items-center w-[100rem] max-w-full mx-auto">
        <span>
          <a href="/" className="text-base-content font-light">
            saiid.ch
          </a>
        </span>

        <nav className="flex space-x-4">
          <a
            href="/publications"
            className="text-base-content font-light hover:underline hover:text-secondary"
          >
            publications
          </a>
          <a
            href="/projects"
            className="text-base-content font-light hover:underline hover:text-secondary"
          >
            projects
          </a>
          <a
            href="/blog"
            className="text-base-content font-light hover:underline hover:text-secondary"
          >
            blog
          </a>
        </nav>

        <span className="flex space-x-4">
          <CVDownloadButton />
          <ThemeToggle
            theme={props.theme}
            onToggleTheme={props.onToggleTheme}
          />
        </span>
      </div>
    </header>
  );
};

export default Header;
