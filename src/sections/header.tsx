import React from "react";
import { IconAndTextButton } from "../components/button";
import constants from "../utils/constants";
import { Drawer } from "../components/drawer";

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = React.useState<string>("light");

  React.useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "light");

    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      role="switch"
      aria-checked={isDark}
      className="pointer-events-auto relative w-14 h-7 rounded-full border-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
      style={{
        backgroundColor: isDark ? "#262420" : "#E45826",
        borderColor: isDark ? "#3d2e1e" : "#c44a1f",
      }}
    >
      {/* Track decoration: stars (dark) / clouds (light) */}
      <span
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ opacity: 0.4 }}
      >
        {isDark ? (
          <>
            <span className="absolute w-1 h-1 bg-secondary-light rounded-full" style={{ top: 5, left: 6, animation: "fadeInUp 0.5s ease-out" }} />
            <span className="absolute w-0.5 h-0.5 bg-secondary-light rounded-full" style={{ top: 14, left: 10, animation: "fadeInUp 0.7s ease-out" }} />
            <span className="absolute w-0.5 h-0.5 bg-secondary-light rounded-full" style={{ top: 8, left: 16, animation: "fadeInUp 0.6s ease-out" }} />
          </>
        ) : (
          <>
            <span className="absolute w-2 h-1.5 bg-white/60 rounded-full" style={{ top: 6, left: 6 }} />
            <span className="absolute w-1.5 h-1 bg-white/40 rounded-full" style={{ top: 16, left: 12 }} />
          </>
        )}
      </span>

      {/* Sliding knob with icon */}
      <span
        className="absolute top-0.5 flex items-center justify-center w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.68,-0.2,0.27,1.3)]"
        style={{
          left: isDark ? "calc(100% - 1.5rem)" : "0.175rem",
          backgroundColor: isDark ? "#1B1A17" : "#FFF9F0",
        }}
      >
        {/* Sun */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFCD6D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute w-3 h-3 transition-all duration-300"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? "rotate(-90deg) scale(0.5)" : "rotate(0deg) scale(1)",
          }}
        >
          <circle cx="12" cy="12" r="5" fill="#FFCD6D" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>

        {/* Moon */}
        <svg
          viewBox="0 0 24 24"
          fill="#E45826"
          className="absolute w-3 h-3 transition-all duration-300"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
          }}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
};

export const CVDownloadButton: React.FC<{ accent?: boolean }> = ({ accent }) => {
  const aRef = React.useRef<HTMLAnchorElement>(null);

  return (
    <IconAndTextButton
      icon={constants.ICONS.DOWN_ARROW}
      onClick={() => aRef.current?.click()}
      accent={accent}
    >
      CV / Résumé
      <a href="/cv.pdf" download className="hidden" ref={aRef} />
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
        "flex gap-x-4 pointer-events-auto " +
        (vertical ? "flex-col gap-y-4" : "")
      }
    >
      <a
        href="/publications/"
        className={
          "!font-light hover:underline " +
          (scrolled ? "!text-[#3d2e1e] hover:!text-[#2a1e10]" : "!text-base-content hover:!text-secondary")
        }
      >
        publications
      </a>
      <a
        href="/projects/"
        className={
          "!font-light hover:underline " +
          (scrolled ? "!text-[#3d2e1e] hover:!text-[#2a1e10]" : "!text-base-content hover:!text-secondary")
        }
      >
        projects
      </a>
      <a
        href="/blog/"
        className={
          "!font-light hover:underline " +
          (scrolled ? "!text-[#3d2e1e] hover:!text-[#2a1e10]" : "!text-base-content hover:!text-secondary")
        }
      >
        blog
      </a>
    </nav>
  );
};

const TopicHeading: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  return <h2 className={"text-secondary font-mono " + className}>{name}</h2>;
};

const HIDE_AFTER_Y = 200;
const SCROLL_DELTA_THRESHOLD = 6;

const Header: React.FC = () => {
  const [scrollY, setScrollY] = React.useState(0);
  const [visible, setVisible] = React.useState(true);
  const [contextTitle, setContextTitle] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [theme, setTheme] = React.useState("light");
  const lastYRef = React.useRef(0);

  React.useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "light");

    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const contextEl = document.querySelector<HTMLElement>("[data-header-title]");
    const contextText =
      contextEl?.getAttribute("data-header-title") ||
      contextEl?.textContent?.trim() ||
      null;

    let ticking = false;
    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrollY(y);

        const delta = y - lastYRef.current;
        if (y < HIDE_AFTER_Y) {
          setVisible(true);
        } else if (Math.abs(delta) > SCROLL_DELTA_THRESHOLD) {
          setVisible(delta < 0);
        }
        lastYRef.current = y;

        if (contextEl && contextText) {
          const rect = contextEl.getBoundingClientRect();
          setContextTitle(rect.bottom < 60 ? contextText : null);
        }

        ticking = false;
      });
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrolled = scrollY > constants.SCROLL_START_THRESHOLD;

  return (
    <>
      <header
        className={
          "fixed top-0 w-full left-0 z-30 transition-transform duration-300 ease-out " +
          (scrolled ? "bg-secondary shadow-md " : "") +
          (visible ? "translate-y-0" : "-translate-y-full")
        }
      >
        <div
          className={
            "py-4 pl-32 px-8 flex justify-between items-center gap-x-6 w-[100rem] max-w-full mx-auto max-md:pl-8 max-md:hidden"
          }
        >
          <span className="flex items-center gap-x-4 min-w-0 shrink">
            <a href="/" className="text-base-content font-light shrink-0">
              saiid.ch
            </a>
            {contextTitle && (
              <>
                <span className="text-base-content/50 shrink-0" aria-hidden="true">
                  /
                </span>
                <span
                  className="text-base-content font-mono text-sm truncate"
                  title={contextTitle}
                >
                  {contextTitle}
                </span>
              </>
            )}
          </span>

          <Navigation scrolled={scrolled} />

          <span className="flex gap-x-4 shrink-0">
            <CVDownloadButton accent={scrolled} />
            <ThemeToggle />
          </span>
        </div>

        <div className="w-full hidden max-md:flex p-8 justify-between items-center gap-x-4">
          <button onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <constants.ICONS.MENU
              className="w-6 h-6"
              style={theme === "dark" ? { filter: "invert(1)" } : {}}
            />
          </button>
          {contextTitle ? (
            <span
              className="text-base-content font-mono text-sm truncate flex-1 text-center"
              title={contextTitle}
            >
              {contextTitle}
            </span>
          ) : (
            <a href="/" className="text-base-content font-light">
              saiid.ch
            </a>
          )}
        </div>
      </header>
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="flex flex-col justify-between h-full items-start gap-y-4">
          <a href="/" className="text-base-content font-light">
            saiid.ch
          </a>
          <div className="flex gap-x-4">
            <CVDownloadButton />
            <ThemeToggle />
          </div>
          <TopicHeading name="Navigation" />
          <Navigation scrolled={scrolled} vertical />
        </div>
      </Drawer>
    </>
  );
};

export default Header;
