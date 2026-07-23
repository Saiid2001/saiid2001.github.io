import React from "react";
import Constants from "../utils/constants";

interface CiteInfo {
  title: string;
  date: string;
  slug: string;
}

const ShareRow: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const [copied, setCopied] = React.useState(false);
  const urlEncoded = encodeURIComponent(url);
  const titleEncoded = encodeURIComponent(title);

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-row flex-wrap justify-center gap-3">
      <a
        href={`https://twitter.com/intent/tweet?url=${urlEncoded}&text=${titleEncoded}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="btn btn-sm btn-outline border-secondary text-secondary hover:btn-secondary">
          Share to <Constants.ICONS.X className="h-4 w-4 ml-1" />
        </button>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${urlEncoded}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="btn btn-sm btn-outline border-secondary text-secondary hover:btn-secondary">
          Share to LinkedIn
        </button>
      </a>
      <a
        href={`https://bsky.app/intent/compose?text=${titleEncoded}%20${urlEncoded}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="btn btn-sm btn-outline border-secondary text-secondary hover:btn-secondary">
          Share to Bluesky
        </button>
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="btn btn-sm btn-outline border-secondary text-secondary hover:btn-secondary"
      >
        {copied ? "Link copied!" : "Copy link"}
      </button>
    </div>
  );
};

const CiteBlock: React.FC<{ cite: CiteInfo; url: string }> = ({ cite, url }) => {
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const year = new Date(cite.date).getFullYear();
  const month = new Date(cite.date).toLocaleDateString("en-US", { month: "long" });
  const key = `elhajjchehade${year}${cite.slug.replace(/[^a-z0-9]/gi, "")}`;

  const bibtex = `@misc{${key},
  author = {El Hajj Chehade, Saiid},
  title = {${cite.title}},
  year = {${year}},
  month = {${month.toLowerCase()}},
  howpublished = {\\url{${url}}},
  note = {Blog post}
}`;

  function copy() {
    navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([bibtex + "\n"], { type: "application/x-bibtex" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${key}.bib`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(href);
  }

  return (
    <details
      className="w-full border border-base-content/10 rounded-lg p-4"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer font-mono text-sm font-semibold">
        Cite this post
      </summary>
      <div className="mt-4 relative">
        <pre className="font-mono text-xs text-secondary bg-secondary/10 p-4 pt-14 whitespace-pre-wrap break-all rounded">
          {bibtex}
        </pre>
        <div className="absolute top-2 left-2 flex flex-row gap-x-2">
          <button
            type="button"
            className="btn btn-xs btn-secondary"
            onClick={download}
            title={`Download ${key}.bib`}
          >
            Download .bib
          </button>
          <button
            type="button"
            className="btn btn-xs btn-secondary btn-outline"
            onClick={copy}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </details>
  );
};

const FeedbackSection: React.FC<{
  slug: string;
  url: string;
  cite?: CiteInfo;
}> = ({ slug, url, cite }) => {
  const [feedback, setFeedback] = React.useState("");

  const emailURL = () => {
    const _feedback =
      "I am writing to provide feedback on the following blog post: " +
      url +
      "\n\n" +
      feedback;
    const encodedFeedback = encodeURIComponent(_feedback);
    const subjectEncoded = encodeURIComponent(`Feedback on ${url}`);
    return `mailto:${Constants.EMAIL}?subject=${subjectEncoded}&body=${encodedFeedback}`;
  };

  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-6">
      {cite && <CiteBlock cite={cite} url={url} />}
      <div className="flex flex-col gap-3 items-center">
        <h2 className="text-2xl font-bold font-mono">Share your thoughts</h2>
        <p className="text-sm text-muted text-center">
          Feedback goes straight to my inbox. No account needed.
        </p>
        <textarea
          className="textarea textarea-bordered w-full textarea-lg"
          style={{ height: "160px", resize: "vertical" }}
          placeholder="How did you find this article?"
          onChange={(e) => setFeedback(e.target.value)}
        />
        <a
          className="btn btn-outline border-secondary text-secondary w-full hover:btn-secondary"
          href={emailURL()}
        >
          Send feedback
        </a>
      </div>
      <ShareRow url={url} title={cite?.title ?? "Blog post"} />
    </div>
  );
};

const BlogPostClient: React.FC<{
  slug: string;
  url: string;
  showFeedback?: boolean;
  cite?: CiteInfo;
}> = ({ slug, url, showFeedback, cite }) => {
  if (showFeedback) {
    return <FeedbackSection slug={slug} url={url} cite={cite} />;
  }
  return <ShareRow url={url} title={cite?.title ?? "Blog post"} />;
};

export default BlogPostClient;
