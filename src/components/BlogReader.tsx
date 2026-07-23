import React from "react";

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

const BlogReader: React.FC<{ contentSelector: string }> = ({ contentSelector }) => {
  const [progress, setProgress] = React.useState(0);
  const [toc, setToc] = React.useState<TocEntry[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");
  const [showToTop, setShowToTop] = React.useState(false);
  const [mobileTocOpen, setMobileTocOpen] = React.useState(false);

  React.useEffect(() => {
    const container = document.querySelector(contentSelector);
    if (!container) return;

    const headings = Array.from(
      container.querySelectorAll("h1, h2, h3")
    ) as HTMLHeadingElement[];

    const seen = new Set<string>();
    const entries: TocEntry[] = headings.map((h) => {
      const base = h.id || slugify(h.textContent || "");
      let id = base || "section";
      let n = 2;
      while (seen.has(id)) id = `${base}-${n++}`;
      seen.add(id);
      h.id = id;

      if (!h.querySelector(".heading-anchor")) {
        const anchor = document.createElement("a");
        anchor.href = `#${id}`;
        anchor.className = "heading-anchor";
        anchor.setAttribute("aria-label", "Link to this section");
        anchor.textContent = "#";
        h.appendChild(anchor);
      }

      return {
        id,
        text: (h.textContent || "").replace(/#$/, "").trim(),
        level: parseInt(h.tagName.substring(1), 10),
      };
    });
    setToc(entries);

    const observer = new IntersectionObserver(
      (obsEntries) => {
        const visible = obsEntries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));

    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const pct = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0;
      setProgress(pct);
      setShowToTop(scrollTop > 800);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [contentSelector]);

  return (
    <>
      <div
        className="fixed top-0 left-0 h-1 bg-secondary z-50 transition-[width] duration-100"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />

      {toc.length > 1 && (
        <>
          <aside className="hidden xl:block fixed right-8 top-32 w-64 max-h-[70vh] overflow-y-auto z-30">
            <div className="border-l-2 border-base-content/10 pl-4">
              <h4 className="text-xs uppercase tracking-wider font-mono text-muted mb-3">
                On this page
              </h4>
              <ul className="flex flex-col gap-y-1 text-sm">
                {toc.map((entry) => (
                  <li
                    key={entry.id}
                    style={{ paddingLeft: `${(entry.level - 1) * 12}px` }}
                  >
                    <a
                      href={`#${entry.id}`}
                      className={
                        "block py-1 transition-colors hover:text-secondary " +
                        (activeId === entry.id
                          ? "text-secondary font-semibold"
                          : "text-muted")
                      }
                    >
                      {entry.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="xl:hidden fixed bottom-24 right-4 z-40">
            <button
              type="button"
              onClick={() => setMobileTocOpen((o) => !o)}
              className="btn btn-circle btn-secondary shadow-lg"
              aria-label="Table of contents"
              aria-expanded={mobileTocOpen}
            >
              ≡
            </button>
            {mobileTocOpen && (
              <div className="absolute bottom-14 right-0 w-72 max-h-[60vh] overflow-y-auto bg-base-100 border border-base-content/20 rounded-lg shadow-xl p-4">
                <h4 className="text-xs uppercase tracking-wider font-mono text-muted mb-2">
                  On this page
                </h4>
                <ul className="flex flex-col gap-y-1 text-sm">
                  {toc.map((entry) => (
                    <li
                      key={entry.id}
                      style={{ paddingLeft: `${(entry.level - 1) * 12}px` }}
                    >
                      <a
                        href={`#${entry.id}`}
                        onClick={() => setMobileTocOpen(false)}
                        className={
                          "block py-1 transition-colors hover:text-secondary " +
                          (activeId === entry.id
                            ? "text-secondary font-semibold"
                            : "text-muted")
                        }
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      {showToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-4 z-40 btn btn-circle btn-secondary btn-outline shadow-lg"
          aria-label="Back to top"
          title="Back to top"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default BlogReader;
