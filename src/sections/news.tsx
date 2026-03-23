import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faPersonChalkboard, faPersonWalkingLuggage } from "@fortawesome/free-solid-svg-icons";

type NewsCategory = "achievement" | "talk" | "travel";

const NEWS_ICONS: Record<NewsCategory, typeof faTrophy> = {
  achievement: faTrophy,
  talk: faPersonChalkboard,
  travel: faPersonWalkingLuggage,
};

const YEAR_THRESHOLD = 3;
const MIN_VISIBLE = 5;

function getInitialCount(news: NewsItem[]): number {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - YEAR_THRESHOLD);
  const recentCount = news.filter((n) => new Date(n.date) >= cutoff).length;
  return Math.max(recentCount, MIN_VISIBLE);
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "a week ago" : `${weeks} weeks ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "a month ago" : `${months} months ago`;
  }
  const years = Math.floor(diffDays / 365);
  return years === 1 ? "a year ago" : `${years} years ago`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export interface NewsItem {
  id: string;
  html: string;
  date: string;
  category: string;
}

export const News: React.FC<{ news: NewsItem[] }> = ({ news }) => {
  const [isClient, setIsClient] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initialCount = getInitialCount(news);
  const visibleNews = showAll ? news : news.slice(0, initialCount);
  const hiddenCount = news.length - initialCount;

  return (
    <div className="border-l-2 border-muted/30 ml-3">
      {visibleNews.map((n) => {
        const category: NewsCategory = (n.category as NewsCategory) || "achievement";
        const icon = NEWS_ICONS[category];
        const relativeTime = isClient ? getRelativeTime(n.date) : "";
        return (
          <div
            key={n.id}
            className="relative py-4 pl-6 flex flex-row items-start gap-x-2 max-w-[800px] hover:bg-secondary/5 transition-colors rounded-r"
          >
            <span className="absolute left-0 top-1/2 -translate-x-1/2 w-3 h-3 bg-secondary rounded-full" />
            <FontAwesomeIcon icon={icon} className="mt-1 w-6 h-6 text-secondary flex-shrink-0" />
            <span>
              <div
                className="text-base-content"
                dangerouslySetInnerHTML={{ __html: n.html }}
              />
              <small className="text-muted text-sm">
                {relativeTime} | {formatDate(n.date)}
              </small>
            </span>
          </div>
        );
      })}
      {hiddenCount > 0 && (
        <button
          className="ml-6 mt-2 text-muted font-mono text-sm hover:underline"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show less" : `Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  );
};
