import React, { useState, useEffect } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faPersonChalkboard, faPersonWalkingLuggage } from "@fortawesome/free-solid-svg-icons";
import { IndexSection } from "../components/IndexSection";

type NewsCategory = "achievement" | "talk" | "travel";

const NEWS_ICONS: Record<NewsCategory, typeof faTrophy> = {
  achievement: faTrophy,
  talk: faPersonChalkboard,
  travel: faPersonWalkingLuggage,
};

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

export const News: React.FC = () => {
  const data = useStaticQuery(graphql`
    query NewsQuery {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/_news/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            id
            html
            frontmatter {
              rawDate: date
              date(formatString: "MMMM YYYY")
              category
            }
          }
        }
      }
    }
  `);

  const news = data.allMarkdownRemark.edges.map((edge: any) => edge.node);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <IndexSection title="/news">
      <div className=" last:border-b-0">
        {news.map((n: any) => {
          const category: NewsCategory = n.frontmatter.category || "achievement";
          const icon = NEWS_ICONS[category];
          const relativeTime = isClient ? getRelativeTime(n.frontmatter.rawDate) : "";
          return (
          <div
            key={n.id}
            className="py-4 flex flex-row items-start gap-x-2 max-w-[800px]"
          >
            <FontAwesomeIcon icon={icon} className="mt-1 w-6 h-6 text-secondary flex-shrink-0" />
            <span>
              <p
                className="text-base-content"
                dangerouslySetInnerHTML={{ __html: n.html }}
              />
              <small className="text-secondary text-sm">
                {relativeTime} | {n.frontmatter.date}
              </small>
            </span>
          </div>
        );
        })}
      </div>
    </IndexSection>
  );
};
