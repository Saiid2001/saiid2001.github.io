import React from "react";

export interface BlogSummary {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  cover: string;
  readTime: number;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const BlogListClient: React.FC<{ posts: BlogSummary[] }> = ({ posts }) => {
  const [query, setQuery] = React.useState("");
  const [activeTags, setActiveTags] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get("tag");
    if (tag) setActiveTags(new Set([tag]));
    const q = params.get("q");
    if (q) setQuery(q);
  }, []);

  const allTags = React.useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [posts]);

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeTags.size > 0 && !p.tags.some((t) => activeTags.has(t))) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, query, activeTags]);

  const grouped = React.useMemo(() => {
    const groups = new Map<string, BlogSummary[]>();
    filtered.forEach((p) => {
      const year = new Date(p.date).getFullYear().toString();
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year)!.push(p);
    });
    return [...groups.entries()].sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  }, [filtered]);

  const [featured, ...rest] = filtered;
  const restGrouped = React.useMemo(() => {
    const groups = new Map<string, BlogSummary[]>();
    rest.forEach((p) => {
      const year = new Date(p.date).getFullYear().toString();
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year)!.push(p);
    });
    return [...groups.entries()].sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  }, [rest]);

  const isFiltering = query.trim().length > 0 || activeTags.size > 0;

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-row items-center gap-x-3 max-md:flex-col max-md:items-stretch max-md:gap-y-2">
          <div className="relative grow">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts by title, tag, or summary…"
              className="input input-bordered w-full font-mono text-sm pr-10"
              aria-label="Search blog posts"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <a
            href="/rss.xml"
            className="btn btn-sm btn-outline border-muted text-muted hover:btn-secondary hover:border-secondary font-mono"
            title="RSS feed"
          >
            RSS
          </a>
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-row flex-wrap gap-2 items-center">
            <span className="text-sm font-mono text-muted">Tags:</span>
            {allTags.map(([tag, count]) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={
                  "badge badge-sm font-mono cursor-pointer transition-colors " +
                  (activeTags.has(tag)
                    ? "badge-secondary"
                    : "badge-outline border-muted text-muted hover:border-secondary hover:text-secondary")
                }
              >
                {tag} <span className="ml-1 opacity-70">{count}</span>
              </button>
            ))}
            {(activeTags.size > 0 || query) && (
              <button
                type="button"
                onClick={() => {
                  setActiveTags(new Set());
                  setQuery("");
                }}
                className="text-xs font-mono text-muted underline hover:text-secondary"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
        <p className="text-sm font-mono text-muted">
          {filtered.length} {filtered.length === 1 ? "post" : "posts"}
          {isFiltering ? ` matching filters (of ${posts.length})` : ""}
        </p>
      </div>

      {filtered.length === 0 && (
        <div className="border border-dashed border-muted/30 rounded p-12 text-center">
          <p className="font-mono text-muted">No posts match your filters.</p>
        </div>
      )}

      {featured && !isFiltering && (
        <a
          href={`/blog/${featured.slug}/`}
          className="group flex flex-col md:flex-row gap-6 p-6 rounded-lg border border-base-content/10 bg-gradient-to-br from-secondary/5 to-transparent hover:border-secondary/40 transition-colors relative overflow-hidden"
        >
          <span className="absolute top-4 right-4 badge badge-secondary badge-sm font-mono">
            Latest
          </span>
          {featured.cover && (
            <img
              src={featured.cover}
              alt=""
              className="w-full md:w-64 h-48 md:h-auto object-cover rounded-md"
            />
          )}
          <div className="flex flex-col gap-y-3 grow">
            <div className="flex flex-row items-center gap-x-3 text-sm font-mono text-muted">
              <span>{formatDate(featured.date)}</span>
              <span>·</span>
              <span>{featured.readTime} min read</span>
            </div>
            <h2 className="text-3xl font-mono font-bold group-hover:text-secondary transition-colors">
              {featured.title}
            </h2>
            <p className="text-lg text-base-content/80">{featured.summary}</p>
            <div className="flex flex-row flex-wrap gap-2 mt-1">
              {featured.tags.map((tag) => (
                <span key={tag} className="badge badge-outline border-muted text-muted font-mono text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </a>
      )}

      {(isFiltering ? grouped : restGrouped).map(([year, entries]) => (
        <section key={year} className="flex flex-col gap-y-4">
          <h3 className="text-xl font-mono text-muted border-b border-base-content/10 pb-2">
            {year}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}/`}
                className="group flex flex-col gap-y-3 p-4 rounded-lg border border-base-content/10 hover:border-secondary/40 hover:bg-secondary/5 transition-colors"
              >
                {post.cover && (
                  <img
                    src={post.cover}
                    alt=""
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}
                <div className="flex flex-row items-center gap-x-2 text-xs font-mono text-muted">
                  <span>{formatDate(post.date)}</span>
                  <span>·</span>
                  <span>{post.readTime} min</span>
                </div>
                <h4 className="text-xl font-mono font-bold group-hover:text-secondary transition-colors">
                  {post.title}
                </h4>
                <p className="text-sm text-base-content/70 line-clamp-3">{post.summary}</p>
                <div className="flex flex-row flex-wrap gap-1 mt-auto">
                  {post.tags.map((tag) => (
                    <span key={tag} className="badge badge-outline border-muted text-muted font-mono text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default BlogListClient;
