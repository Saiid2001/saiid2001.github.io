import React from "react";

type ReaderTheme = "light" | "sepia" | "dark";

const FONT_STEPS = [16, 18, 20, 22, 24, 26];

const ReaderToolbar: React.FC<{ backHref: string }> = ({ backHref }) => {
  const [fontIdx, setFontIdx] = React.useState(2);
  const [theme, setTheme] = React.useState<ReaderTheme>("light");

  React.useEffect(() => {
    const storedTheme = (localStorage.getItem("reader-theme") as ReaderTheme) || "light";
    const storedFont = parseInt(localStorage.getItem("reader-font") || "2", 10);
    setTheme(storedTheme);
    if (!Number.isNaN(storedFont) && storedFont >= 0 && storedFont < FONT_STEPS.length) {
      setFontIdx(storedFont);
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.remove(
      "reader-theme-light",
      "reader-theme-sepia",
      "reader-theme-dark"
    );
    document.documentElement.classList.add(`reader-theme-${theme}`);
    localStorage.setItem("reader-theme", theme);
  }, [theme]);

  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--reader-font-size",
      `${FONT_STEPS[fontIdx]}px`
    );
    localStorage.setItem("reader-font", String(fontIdx));
  }, [fontIdx]);

  return (
    <div className="reader-toolbar">
      <a href={backHref} title="Return to full article">
        ← Full article
      </a>
      <div className="reader-toolbar-group">
        <button
          type="button"
          onClick={() => setFontIdx((i) => Math.max(0, i - 1))}
          disabled={fontIdx === 0}
          aria-label="Decrease font size"
          title="Smaller text"
        >
          A−
        </button>
        <button
          type="button"
          onClick={() => setFontIdx((i) => Math.min(FONT_STEPS.length - 1, i + 1))}
          disabled={fontIdx === FONT_STEPS.length - 1}
          aria-label="Increase font size"
          title="Larger text"
        >
          A+
        </button>
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={theme === "light" ? "theme-active" : ""}
          title="Light"
          aria-label="Light theme"
        >
          Light
        </button>
        <button
          type="button"
          onClick={() => setTheme("sepia")}
          className={theme === "sepia" ? "theme-active" : ""}
          title="Sepia"
          aria-label="Sepia theme"
        >
          Sepia
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "theme-active" : ""}
          title="Dark"
          aria-label="Dark theme"
        >
          Dark
        </button>
      </div>
    </div>
  );
};

export default ReaderToolbar;
