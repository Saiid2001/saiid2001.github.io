import * as React from "react";
import Layout from "../../sections/layout";
import { PageProps, graphql } from "gatsby";
import { Heading } from "../../components/heading";
import { GatsbyImage } from "gatsby-plugin-image";

interface BlogProps {
  title: string;
  date: string;
  tags: string[];
  timeToRead: number;
  excerpt: string;
  slug: string;
  cover: any;
}

const Blog: React.FC<BlogProps> = (props) => {
  return (
    <div
      className="flex flex-row gap-4 cursor-pointer p-4 py-14 border-b-2 border-base-content/20 hover:bg-secondary/5 transition-colors rounded max-md:py-4"
      key={props.slug}
      onClick={() =>
        window ? (window.location.href = "/blog/" + props.slug) : null
      }
    >
      <div className="w-40 max-md:hidden">
        <GatsbyImage
          image={props.cover.childImageSharp.gatsbyImageData}
          alt={props.title}
          className=" h-40 w-40  rounded-full aspect-square grow"
        />
      </div>
      <div className="flex flex-col gap-y-2 grow-0">
        <h1 className="text-3xl font-bold font-mono">{props.title}</h1>
        <p className="text-lg">
          {props.date} | {props.timeToRead} min read
        </p>
        {props.tags.map((tag) => (
          <span key={tag} className="badge badge-outline mr-2">
            {tag}
          </span>
        ))}
        <p className="text-lg"></p>
        <p className="text-lg">
          {props.excerpt}
          <em className="text-secondary">Read More</em>
        </p>
      </div>
    </div>
  );
};

interface BlogsPageProps extends PageProps {
  data: {
    allMarkdownRemark: {
      edges: {
        node: {
          timeToRead: number;
          frontmatter: {
            slug: string;
            date: string;
            title: string;
            tags: string[];
            cover: { childImageSharp: { gatsbyImageData: any } };
          };
          excerpt: string;
        };
      }[];
    };
  };
}

export const BlogsPage: React.FC<BlogsPageProps> = (props) => {
  const blogs = props.data.allMarkdownRemark.edges;

  return (
    <Layout {...props}>
      <div className="flex flex-col items-left px-8 justify-center w-full h-full mt-32 max-md:px-4">
        <Heading name="Blogs"></Heading>
        <section className="flex flex-col gap-y-4 mt-10">
          {blogs.map(({ node }) => (
            <Blog
              title={node.frontmatter.title}
              date={node.frontmatter.date}
              tags={node.frontmatter.tags}
              timeToRead={node.timeToRead}
              excerpt={node.excerpt}
              slug={node.frontmatter.slug}
              cover={node.frontmatter.cover}
            />
          ))}
        </section>
      </div>
    </Layout>
  );
};
export default BlogsPage;

export const Head: React.FC = () => <title>Saiid's Blog</title>;

export const query = graphql`
  query {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/_blogs/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          timeToRead
          frontmatter {
            slug
            date(fromNow: true, formatString: "DD MMM YYYY")
            title
            tags
            cover {
              childImageSharp {
                gatsbyImageData(width: 200)
              }
            }
          }
          excerpt(format: PLAIN)
        }
      }
    }
  }
`;
