import React from "react";
import type { Publication } from "../lib/parse-bibtex";

import "../styles/publications.css";

function cleanTitle(title: string): string {
  return title.replace(/\{|\}/g, '');
}

function normalizeVenue(booktitle: string): string {
  return booktitle
    .replace(/\{|\}/g, '')
    .replace(/^\d{4}\s*/, '')
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .trim();
}

const PublicationCard: React.FC<{ pub: Publication }> = ({ pub }) => {
  const [copied, setCopied] = React.useState(false);

  function copy() {
    navigator.clipboard.writeText(pub.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  React.useEffect(() => {
    if (window.location.hash === "#" + pub.key) {
      const elem = document.getElementById(pub.key);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: "smooth" });
          elem.classList.add("paper-highlight");
        }, 500);
      }
    }
  }, []);

  return (
    <div id={pub.key} className="flex flex-col gap-y-2 relative group pl-8">
      <a href={"#" + pub.key} className="text-lg font-semibold absolute left-4 hidden group-hover:block">
        #
      </a>
      <h2 className="text-2xl font-bold">{cleanTitle(pub.title)}</h2>
      <p className="text-lg text-muted">{pub.author}</p>
      <p className="text-lg italic text-muted">{pub.booktitle}</p>
      <section className="flex flex-row gap-x-2">
        {pub.paper_file && (
          <p>
            [<a href={pub.paper_file} className="underline">
              Paper
            </a>]
          </p>
        )}
        {pub.code_url && (
          <p>
            [<a href={pub.code_url} className="underline" target="_blank" rel="noopener noreferrer">
              Code
            </a>]
          </p>
        )}
      </section>
      <details className="flex flex-col gap-y-2 pr-40 max-lg:pr-0">
        <summary className="text-lg font-semibold">BibTeX</summary>
        <div className="relative">
          <p className="font-mono text-secondary bg-secondary/20 p-8 pt-12 break-all">
            {pub.raw}
          </p>
          <button
            className="btn btn-secondary btn-ghost absolute top-0 left-0"
            onClick={copy}
          >
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>
        </div>
      </details>
    </div>
  );
};

const PublicationsClient: React.FC<{ publications: Publication[] }> = ({ publications }) => {
  const [filterYear, setFilterYear] = React.useState<string | null>(null);
  const [filterVenue, setFilterVenue] = React.useState<string | null>(null);

  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => parseInt(b) - parseInt(a));

  // Deduplicate venues by normalized name
  const venueMap = new Map<string, string>();
  publications.forEach((p) => {
    if (p.booktitle) {
      const normalized = normalizeVenue(p.booktitle);
      if (!venueMap.has(normalized)) {
        venueMap.set(normalized, p.booktitle);
      }
    }
  });
  const venues = [...venueMap.entries()];

  const filtered = publications.filter((p) => {
    if (filterYear && p.year !== filterYear) return false;
    if (filterVenue) {
      const normalized = normalizeVenue(p.booktitle);
      const filterNormalized = normalizeVenue(filterVenue);
      if (normalized !== filterNormalized) return false;
    }
    return true;
  });

  const groupedByYear = filtered.reduce(
    (acc: Record<string, Publication[]>, pub) => {
      const year = pub.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(pub);
      return acc;
    },
    {}
  );

  return (
    <div className="mt-32 pl-32 flex flex-col gap-y-8 max-md:px-8 min-h-[70vh]">
      <span>
        <span className="absolute w-screen h-10 gradient-overlay-2 z-20 left-0"></span>
        <h1 className="text-4xl text-base-content font-mono">
          GET <b>/publications</b>
        </h1>
      </span>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-mono text-muted">Year:</span>
        {years.map((year) => (
          <button
            key={year}
            className={
              "btn btn-sm " +
              (filterYear === year ? "btn-secondary" : "btn-outline border-muted text-muted")
            }
            onClick={() => setFilterYear(filterYear === year ? null : year)}
          >
            {year}
          </button>
        ))}
        {venues.length > 1 && (
          <>
            <span className="text-sm font-mono text-muted ml-4">Venue:</span>
            {venues.map(([normalized, raw]) => (
              <button
                key={normalized}
                className={
                  "btn btn-sm " +
                  (filterVenue === raw ? "btn-secondary" : "btn-outline border-muted text-muted")
                }
                onClick={() => setFilterVenue(filterVenue === raw ? null : raw)}
              >
                {normalized}
              </button>
            ))}
          </>
        )}
      </div>
      <p className="text-sm font-mono text-muted">{filtered.length} publication(s)</p>
      {Object.keys(groupedByYear)
        .sort((a, b) => parseInt(b) - parseInt(a))
        .map((year) => (
          <div key={year} className="flex flex-col gap-y-4">
            <span>
              <span className="absolute w-screen h-10 gradient-overlay-2 z-20 left-0"></span>
              <h2 className="text-3xl text-base-content font-mono">
                GET <b>{year}</b>
              </h2>
            </span>
            <div className="flex flex-col gap-y-4">
              {groupedByYear[year].map((pub) => (
                <PublicationCard key={pub.key} pub={pub} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default PublicationsClient;
