import React from "react";
import Constants from "../utils/constants";
import { CVDownloadButton, Navigation, ThemeToggle } from "./header";

type SocialButtonProps = {
  className: string;
  bare?: boolean;
};

const SOCIAL_LINKS = [
  { href: "https://www.linkedin.com/in/saiid-hc/", label: "LinkedIn", Icon: Constants.ICONS.LINKEDIN },
  { href: "https://github.com/Saiid2001", label: "GitHub", Icon: Constants.ICONS.GITHUB },
  { href: "https://scholar.google.com/citations?user=gF0rvJAAAAAJ&hl=en", label: "Google Scholar", Icon: Constants.ICONS.SCHOLAR },
  { href: "https://x.com/saiid_hc", label: "X (Twitter)", Icon: Constants.ICONS.X },
];

const SocialButtons: React.FC<SocialButtonProps> = ({ className, bare }) => {
  return (
    <div className={className}>
      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          className={bare ? "text-primary opacity-80 hover:opacity-100 transition-opacity" : "btn btn-secondary btn-square"}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon className={bare ? "h-6 w-6" : "h-10 w-10 p-1 rounded opacity-70 hover:opacity-100 transition-opacity"} />
        </a>
      ))}
    </div>
  );
};

const SCRAMBLE_CHARS = "0123456789abcdef";
const EMAIL = Constants.EMAIL;

function hashDateString(): string {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash + today.charCodeAt(i)) | 0;
  }
  // Convert to hex-like string padded to email length
  const hex = Math.abs(hash).toString(16);
  let result = "";
  for (let i = 0; i < EMAIL.length; i++) {
    result += hex[i % hex.length];
  }
  return result;
}

function canScramble(): boolean {
  if (typeof window === "undefined") return false;
  return !window.matchMedia("(max-width: 768px)").matches && !window.matchMedia("(hover: none)").matches;
}

const EmailCTA: React.FC = () => {
  const [displayText, setDisplayText] = React.useState(EMAIL);
  const [copied, setCopied] = React.useState(false);
  const [revealed, setRevealed] = React.useState(true);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const ref = React.useRef<HTMLButtonElement>(null);

  // Sync scramble state with screen size
  React.useEffect(() => {
    if (canScramble()) {
      setDisplayText(hashDateString());
      setRevealed(false);
    }

    function onResize() {
      if (!canScramble()) {
        clearTimer();
        setDisplayText(EMAIL);
        setRevealed(true);
      }
    }

    const mq = window.matchMedia("(max-width: 768px)");
    mq.addEventListener("change", onResize);
    return () => mq.removeEventListener("change", onResize);
  }, []);

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function scrambleReveal() {
    if (timerRef.current || !canScramble()) return;
    setRevealed(false);
    const target = EMAIL;
    const duration = 800;
    const steps = 25;
    const interval = duration / steps;
    let step = 0;

    timerRef.current = setInterval(() => {
      step++;
      const progress = step / steps;
      const revealedCount = Math.floor(progress * target.length);
      let text = "";
      for (let i = 0; i < target.length; i++) {
        if (i < revealedCount) {
          text += target[i];
        } else {
          text += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      setDisplayText(text);
      if (step >= steps) {
        clearTimer();
        setDisplayText(target);
        setRevealed(true);
      }
    }, interval);
  }

  function rescramble() {
    if (copied || !canScramble()) return;
    clearTimer();
    setRevealed(false);
    setDisplayText(
      hashDateString()
    );
  }

  function handleClick() {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      clearTimer();
      setRevealed(true);
      setTimeout(() => {
        setCopied(false);
        setDisplayText(EMAIL);
      }, 2000);
    });
  }

  return (
    <div className="flex w-full gap-2">
      <div className="tooltip tooltip-bottom flex-1" data-tip={copied ? "Copied!" : "Click to copy"}>
      <button
        ref={ref}
        onClick={handleClick}
        onMouseEnter={scrambleReveal}
        onMouseLeave={rescramble}
        onFocus={scrambleReveal}
        onBlur={rescramble}
        className="w-full font-mono text-sm border-2 border-secondary/40 rounded px-4 py-2.5 text-left hover:border-secondary transition-colors bg-secondary/5 relative overflow-hidden cursor-pointer"
      >
        <span className="text-muted select-none">$ mailto </span>
        <span className="text-secondary">
          {copied ? "copied to clipboard!" : displayText}
        </span>
        <span className={
          "inline-block w-2 h-4 bg-secondary ml-0.5 align-middle " +
          (copied ? "hidden" : "animate-pulse")
        } />
      </button>
      </div>
      <a
        href={`mailto:${EMAIL}`}
        className="flex items-center justify-center w-10 border-2 border-secondary/40 rounded hover:border-secondary hover:bg-secondary/10 transition-colors"
        aria-label="Open email client"
        title="Open in email client"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-secondary">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </a>
    </div>
  );
};

export const Banner: React.FC<{ summaryHtml: string }> = ({ summaryHtml }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    let ticking = false;
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (ref.current) {
            setScrollY(window.scrollY / ref.current.clientHeight);
          }
          ticking = false;
        });
        ticking = true;
      }
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
        <div className="banner-pattern absolute inset-0 text-secondary z-0" />
        <div className="gradient-overlay-2 absolute left-0 top-0 h-full w-80 z-0" />
        <div className="relative pt-20 flex flex-row gap-x-12 justify-between pl-32 z-20 max-md:flex-col-reverse max-md:items-center max-md:px-8 max-md:gap-8">
          <section className="w-96 max-md:max-w-full">
            <h1 className="font-bold font-mono text-4xl mb-2 max-md:text-center animate-fade-in-up">
              SAIID EL HAJJ CHEHADE
            </h1>
            <p className="text-muted font-mono text-sm mb-8 max-md:text-center animate-fade-in-up delay-100">
              PhD Candidate &middot; EPFL SPRING Lab &middot; Web Privacy &amp; Security
            </p>

            <div className="animate-fade-in-up delay-200">
              <div
                className="gap-y-4 blog no-indent"
                dangerouslySetInnerHTML={{ __html: summaryHtml }}
              />
              <SocialButtons className="flex flex-row items-center gap-2 my-6 max-md:justify-center" />
              <EmailCTA />
            </div>
          </section>
          <div className="relative max-md:flex max-md:justify-center">
            <img
              src="/images/profile.jpeg"
              alt="Portrait of Saiid El Hajj Chehade"
              className="min-h-72 h-full max-h-[520px] max-md:h-52 max-md:min-h-0 max-md:w-52 max-md:rounded-full object-cover profile-fade"
            />
          </div>
        </div>
      </section>

      <section className={
        "fixed w-full top-0 left-0 right-0 bg-secondary text-[#3d2e1e] z-30 max-md:hidden transition-all duration-300 " +
        (scrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none")
      }>
        <div className="flex flex-row items-top gap-x-4 justify-stretch w-full">
          <img
            src="/images/profile.jpeg"
            alt="Profile picture"
            className="h-28 w-28 object-cover"
          />
          <div className="pt-4 pl-4 pr-8 w-full grow flex flex-col">
            <div className="flex flex-row w-full items-center gap-x-2">
              <h1 className="font-bold font-mono text-lg grow">
                SAIID EL HAJJ CHEHADE
              </h1>
              <SocialButtons className="flex gap-x-3 items-center" bare />
              <a
                href={`mailto:${Constants.EMAIL}`}
                className="btn btn-outline btn-sm border-[#3d2e1e]/50 text-[#3d2e1e]"
              >
                Send Email
              </a>
              <CVDownloadButton accent={scrolled} />
              <ThemeToggle />
            </div>
            <div className="flex flex-row items-center gap-x-4">
              <a href="/" className="text-[#3d2e1e] font-light">
                saiid.ch
              </a>
              <Navigation scrolled={scrolled} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
