import { StaticImage } from "gatsby-plugin-image";
import React from "react";

import { graphql, useStaticQuery } from "gatsby";
import Constants from "../utils/constants";
import { CVDownloadButton, Navigation, ThemeToggle } from "./header";

type SocialButtonProps = {
  className: string;
};

const SocialButtons: React.FC<SocialButtonProps> = ({ className }) => {
  return (
    <div className={className}>
      <a
        href="https://www.linkedin.com/in/saiid-hc/"
        className="btn  btn-secondary btn-square"
      >
        <Constants.ICONS.LINKEDIN className="h-10 w-10 p-1 rounded opacity-50" />
      </a>
      <a
        href="https://github.com/Saiid2001"
        className="btn btn-secondary  btn-square"
      >
        <Constants.ICONS.GITHUB className="h-10 w-10 p-2 rounded opacity-50" />
      </a>
      <a
        href="https://scholar.google.com/citations?user=gF0rvJAAAAAJ&hl=en"
        className="btn btn-secondary btn-square"
      >
        <Constants.ICONS.SCHOLAR className="h-10 w-10 p-1 rounded opacity-50" />
      </a>
      <a
        href="https://x.com/saiid_hc"
        className="btn  btn-secondary btn-square"
      >
        <Constants.ICONS.X className="h-10 w-10 p-2 rounded opacity-50" />
      </a>
    </div>
  );
};

export const Banner: React.FC<{
  theme: string | undefined;
  onToggleTheme: (theme: string) => void;
}> = ({ theme, onToggleTheme }) => {
  const data = useStaticQuery(graphql`
    query BannerQuery {
      markdownRemark(fileAbsolutePath: { regex: "/summary.md/" }) {
        html
      }
    }
  `);

  const summary = data.markdownRemark.html;

  // get the scroll y position
  const ref = React.useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    if (!window) return;

    function handleScroll() {
      setScrollY(window.scrollY / ref.current?.clientHeight!);
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrolled = scrollY > 0.5;

  return (
    <>
      <section
        className={"relative w-full " + (scrolled ? "-z-50 max-md:z-0" : "")}
        ref={ref}
      >
        <div className="gradient-overlay-2 absolute left-0 top-0 h-full w-80 z-0" />
        <div className="relative pt-20 flex flex-row gap-x-12 justify-between pl-32 z-20 max-md:flex-col-reverse max-md:items-center max-md:px-8 max-md:gap-8">
          <section className="w-96 max-md:max-w-full">
            <h1 className="font-bold font-mono text-4xl mb-10 max-md:text-center">
              SAIID EL HAJJ CHEHADE
            </h1>

            <div className="relative max-md:flex max-md:flex-col max-md:gap-4">
              <div
                className="gap-y-4"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
              <SocialButtons className="flex flex-col items-center gap-2 absolute -left-16 top-0 max-md:relative max-md:flex-row max-md:left-0 max-md:my-0 max-md:justify-center" />
              <a
                className="btn btn-secondary btn-outline my-10 w-full max-md:my-0"
                href={`mailto:${Constants.EMAIL}`}
              >
                EMAIL {Constants.EMAIL}
              </a>
            </div>
          </section>
          <div className="relative">
            <StaticImage
              src="../images/profile.png"
              alt="Profile picture"
              className="min-h-72 h-full max-md:h-52 max-md:min-h-0 max-md:w-52 max-md:rounded-full"
            />
            <div className="gradient-overlay absolute w-full h-full top-0 left-0 max-md:hidden"></div>
          </div>
        </div>
      </section>

      {/* if the user has scrolled past the threshold, return a smaller banner */}

      {scrolled && (
        <section className="fixed w-full top-0 left-0 right-0 bg-secondary text-primary z-30 max-md:hidden">
          <div className="flex flex-row items-top gap-x-4 justify-stretch w-full">
            <StaticImage
              src="../images/profile.png"
              alt="Profile picture"
              className="h-28 w-28"
            />
            <div className="pt-4 pl-4 pr-8 w-full grow flex flex-col">
              <div className="flex flex-row w-full items-center gap-x-2">
                <h1 className="font-bold font-mono text-lg grow">
                  SAIID EL HAJJ CHEHADE
                </h1>
                <SocialButtons className="flex gap-x-2 scale-75" />
                <a
                  href={`mailto:${Constants.EMAIL}`}
                  className="btn btn-outline btn-sm"
                >
                  Send Email
                </a>
                <CVDownloadButton accent={scrolled} />
                <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
              </div>
              <div className="flex flex-row items-center gap-x-4">
                <a href="/" className="text-base-content font-light">
                  saiid.ch
                </a>
                <Navigation scrolled={scrolled} />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
