import React from "react";
import Constants from "../utils/constants";

const ShareButtons: React.FC<{ url: string }> = ({ url }) => {
  const urlEncoded = encodeURIComponent(url);

  return (
    <div className="flex flex-row justify-left gap-4 mt-4 max-lg:flex-col">
      <a
        href={`https://twitter.com/intent/tweet?url=${urlEncoded}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="btn btn-outline border-secondary text-secondary">
          Share to{" "}
          <Constants.ICONS.X className="h-4 w-4 text-secondary" />
        </button>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${urlEncoded}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="btn btn-outline border-secondary text-secondary">
          Share to Linkedin
        </button>
      </a>
    </div>
  );
};

const FeedbackSection: React.FC<{ slug: string; url: string }> = ({ slug, url }) => {
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
    <div className="max-w-[800px] mx-auto flex flex-col gap-4 items-center gap-x-4 mt-4">
      <h1 className="text-2xl font-bold">Share your thoughts</h1>
      <textarea
        className="textarea textarea-bordered w-full textarea-lg"
        style={{ height: "200px", resize: "vertical" }}
        placeholder="How did you find this article?"
        onChange={(e) => setFeedback(e.target.value)}
      ></textarea>
      <a
        className="btn btn-outline border-secondary text-secondary w-full"
        href={emailURL()}
      >
        Send Feedback
      </a>
      <ShareButtons url={url} />
    </div>
  );
};

const BlogPostClient: React.FC<{
  slug: string;
  url: string;
  showFeedback?: boolean;
}> = ({ slug, url, showFeedback }) => {
  if (showFeedback) {
    return <FeedbackSection slug={slug} url={url} />;
  }
  return <ShareButtons url={url} />;
};

export default BlogPostClient;
