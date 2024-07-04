import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Constants from "../utils/constants";
import { Heading } from "../components/heading";

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
              fromNow: date(fromNow: true)
              date(formatString: "MMMM YYYY")
            }
          }
        }
      }
    }
  `);

  const news = data.allMarkdownRemark.edges.map((edge: any) => edge.node);

  return (
    <div className="flex flex-col items-left pl-32 my-10 w-full pr-8">
      <Heading name="/news" />
      <div className=" last:border-b-0">
        {news.map((n: any) => (
          <div key={n.id} className="py-4 border-b-2 border-b-base-content/20 flex flex-row items-start space-x-2">
            <Constants.ICONS.TROPHY className="mt-1 w-10 h-10 text-secondary" />
            <span>
            <p
              className="text-base-content"
              dangerouslySetInnerHTML={{ __html: n.html }}
            />
            <small className="text-secondary text-sm">
              {n.frontmatter.fromNow} | {n.frontmatter.date}
            </small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
