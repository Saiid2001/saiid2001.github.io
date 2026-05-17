import React from "react";
import type { Publication, PublicationStatus } from "../lib/parse-bibtex";

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

function venueText(pub: Publication): string {
  return pub.booktitle || pub.journal || pub.note || '';
}

function statusBadgeLabel(status: Publication['status']): string | null {
  if (status === 'preprint') return 'Preprint';
  if (status === 'submitted') return 'Under Submission';
  return null;
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
      <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="text-2xl font-bold">{cleanTitle(pub.title)}</h2>
        {statusBadgeLabel(pub.status) && (
          <span className="badge badge-secondary badge-outline font-mono text-xs">
            {statusBadgeLabel(pub.status)}
          </span>
        )}
      </div>
      <p className="text-lg text-muted">{pub.author}</p>
      {venueText(pub) && (
        <p className="text-lg italic text-muted">{venueText(pub)}</p>
      )}
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
      {pub.status !== 'submitted' && (
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
      )}
    </div>
  );
};

const PublicationsClient: React.FC<{ publications: Publication[] }> = ({ publications }) => {
  const [filterYear, setFilterYear] = React.useState<string | null>(null);
  const [filterVenues, setFilterVenues] = React.useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = React.useState<PublicationStatus | 'all'>('all');
  const [venueOpen, setVenueOpen] = React.useState(false);
  const venueRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!venueOpen) return;
    function onDocClick(e: MouseEvent) {
      if (venueRef.current && !venueRef.current.contains(e.target as Node)) {
        setVenueOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [venueOpen]);

  function toggleVenue(normalized: string) {
    setFilterVenues((prev) => {
      const next = new Set(prev);
      if (next.has(normalized)) next.delete(normalized);
      else next.add(normalized);
      return next;
    });
  }

  const years = [...new Set(publications.filter((p) => p.status === 'published').map((p) => p.year))].sort((a, b) => parseInt(b) - parseInt(a));

  // Deduplicate venues by normalized name
  const venueMap = new Map<string, string>();
  publications.forEach((p) => {
    if (p.status === 'published' && p.booktitle) {
      const normalized = normalizeVenue(p.booktitle);
      if (!venueMap.has(normalized)) {
        venueMap.set(normalized, p.booktitle);
      }
    }
  });
  const venues = [...venueMap.entries()];

  const filtered = publications.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterYear && (p.status !== 'published' || p.year !== filterYear)) return false;
    if (filterVenues.size > 0) {
      const normalized = normalizeVenue(p.booktitle);
      if (!filterVenues.has(normalized)) return false;
    }
    return true;
  });

  const preprints = filtered.filter((p) => p.status === 'preprint');
  const submitted = filtered.filter((p) => p.status === 'submitted');
  const published = filtered.filter((p) => p.status === 'published');

  const groupedByYear = published.reduce(
    (acc: Record<string, Publication[]>, pub) => {
      const year = pub.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(pub);
      return acc;
    },
    {}
  );

  const renderSection = (id: string, label: string, entries: Publication[]) => {
    if (entries.length === 0) return null;
    return (
      <div key={id} className="flex flex-col gap-y-4">
        <span>
          <span className="absolute w-screen h-10 gradient-overlay-2 z-20 left-0"></span>
          <h2 className="text-3xl text-base-content font-mono">
            GET <b>{label}</b>
          </h2>
        </span>
        <div className="flex flex-col gap-y-4">
          {entries.map((pub) => (
            <PublicationCard key={pub.key} pub={pub} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-32 pl-32 flex flex-col gap-y-8 max-md:px-8 min-h-[70vh]">
      <span>
        <span className="absolute w-screen h-10 gradient-overlay-2 z-20 left-0"></span>
        <h1 className="text-4xl text-base-content font-mono">
          GET <b>/publications</b>
        </h1>
      </span>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-mono text-muted">Status:</span>
        {([
          ['all', 'All'],
          ['published', 'Published'],
          ['preprint', 'Preprint'],
          ['submitted', 'Under Submission'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            className={
              "btn btn-sm " +
              (filterStatus === value ? "btn-secondary" : "btn-outline border-muted text-muted")
            }
            onClick={() => {
              setFilterStatus(value);
              if (value !== 'all' && value !== 'published') setFilterYear(null);
            }}
          >
            {label}
          </button>
        ))}
        {(filterStatus === 'all' || filterStatus === 'published') && (
          <>
            <span className="text-sm font-mono text-muted ml-4">Year:</span>
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
          </>
        )}
        {venues.length > 1 && (
          <>
            <span className="text-sm font-mono text-muted ml-4">Venue:</span>
            <div ref={venueRef} className="relative">
              <button
                type="button"
                className={
                  "btn btn-sm " +
                  (filterVenues.size > 0 ? "btn-secondary" : "btn-outline border-muted text-muted")
                }
                onClick={() => setVenueOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={venueOpen}
              >
                {filterVenues.size === 0
                  ? "All venues"
                  : `${filterVenues.size} venue${filterVenues.size === 1 ? '' : 's'}`}
                <span className="ml-1">▾</span>
              </button>
              {venueOpen && (
                <div className="absolute left-0 top-full mt-1 z-30 w-72 max-h-72 overflow-y-auto bg-base-100 border border-muted/40 rounded-md shadow-lg p-2">
                  {filterVenues.size > 0 && (
                    <button
                      type="button"
                      className="btn btn-xs btn-ghost text-muted w-full justify-start mb-1"
                      onClick={() => setFilterVenues(new Set())}
                    >
                      Clear selection
                    </button>
                  )}
                  <ul className="flex flex-col">
                    {venues.map(([normalized]) => (
                      <li key={normalized}>
                        <label className="flex items-center gap-2 px-2 py-1 rounded hover:bg-base-200 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-xs checkbox-secondary"
                            checked={filterVenues.has(normalized)}
                            onChange={() => toggleVenue(normalized)}
                          />
                          <span>{normalized}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <p className="text-sm font-mono text-muted">
        {published.length} published
        <span className="mx-2">·</span>
        {preprints.length + submitted.length} unpublished
      </p>
      {renderSection('preprints', '/preprints', preprints)}
      {renderSection('submitted', '/under-submission', submitted)}
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
