import * as React from "react";
import { HeadProps, PageProps, graphql, navigate } from "gatsby";
import Layout from "../../sections/layout";
import { NavigationLink } from "../../components/navigation";
import Constants from "../../utils/constants";
import { GatsbyImage, StaticImage } from "gatsby-plugin-image";
require(`katex/dist/katex.min.css`);
require("prismjs/themes/prism-solarizedlight.css");
require("prismjs/plugins/line-numbers/prism-line-numbers.css");
require("../../styles/blog.css");

const ShareButtons: React.FC<{ url: string }> = ({ url }) => {
  const urlEncoded = encodeURIComponent(url);

  return (
    <div className="flex flex-row justify-left gap-4 mt-4 max-lg:flex-col">
      <a
        href={`https://twitter.com/intent/tweet?url=${urlEncoded}`}
        target="_blank"
        rel="noreferrer"
      >
        <button className="btn btn-outline border-secondary text-secondary">
          Share to{" "}
          <Constants.ICONS.X
            className="h-4 w-4"
            style={{
              filter:
                "invert(47%) sepia(78%) saturate(2576%) hue-rotate(344deg) brightness(90%) contrast(97%)",
            }}
          />
        </button>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${urlEncoded}`}
        target="_blank"
        rel="noreferrer"
      >
        <button className="btn btn-outline border-secondary text-secondary">
          Share to Linkedin
        </button>
      </a>
    </div>
  );
};

const FeedbackSection: React.FC<{ slug: string }> = ({ slug }) => {
  // feedback box and send by email to me
  const [feedback, setFeedback] = React.useState("");

  const url = "https://" + Constants.DOMAIN + "/blog/" + slug;

  const emailURL = () => {
    const _feedback =
      "I am writing to provide feedback on the following blog post: " +
      url +
      "\n\n" +
      feedback;

    // encode
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
        placeholder={"How did you find this article?"}
        onChange={(e) => setFeedback(e.target.value)}
      ></textarea>
      <a
        className="btn btn-outline border-secondary text-secondary w-full"
        href={emailURL()}
      >
        Send Feedback
      </a>
      <ShareButtons url={url} />
      <button
        className="btn btn-link  text-secondary mt-4"
        onClick={() => window?.scrollTo(0, 0)}
      >
        Back to top
      </button>
    </div>
  );
};

type FrontMatterType = {
  title: string;
  date: string;
  tags: string[];
  summary: string;
  slug: string;
  cover: {
    childImageSharp: {
      gatsbyImageData: any;
    };
  };
};

type MarkdownRemarkType = {
  html: string;
  frontmatter: FrontMatterType;
  timeToRead: number;
  wordCount: {
    words: number;
  };
};


interface BlogPostTemplateProps extends PageProps {
  data: {
    markdownRemark: MarkdownRemarkType;
  };
}

export const BlogPostTemplate: React.FC<BlogPostTemplateProps> = (props) => {
  const { data } = props;
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const frontmatter = markdownRemark?.frontmatter;
  const html = markdownRemark?.html;
  const timeToRead = markdownRemark?.timeToRead;

  const url = Constants.DOMAIN + "/blog/" + frontmatter?.slug;

  if (!frontmatter) {
    if (typeof window !== "undefined") navigate("/404");
    return null;
  }

  // get the image from data
  const cover = frontmatter.cover.childImageSharp.gatsbyImageData;


  return (
    <Layout {...props} noMargin>
      <div className=" mb-10 ">
        <header className="relative w-screen header-gradient gap-10 flex flex-row justify-left pr-24">
          <div className="grow">
            <GatsbyImage
              image={cover}
              alt="Cover"
              className="h-full w-full max-md:opacity-30 max-md:absolute max-md:top-0 max-md:left-0 pointer-events-none"
              style={{
                maskImage:
                  "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0))",
              }}
              sizes="100vw"
            />
          </div>

          <div className="pt-24 pb-20 w-5/12 max-w-[600px] max-md:w-full max-md:p-8 max-md:pt-28 max-md:max-w-none z-20">
            <NavigationLink to="/blog">all blogs</NavigationLink>
            <h1 className="font-mono text-5xl mt-8 mb-4 ">
              {frontmatter.title}
            </h1>
            <h2>{frontmatter.date}</h2>
            {frontmatter.tags.map((tag) => (
              <span key={tag} className="badge badge-outline mr-2">
                {tag}
              </span>
            ))}
            <hr className="my-4 border-base-content/20" />
            <p className="text-lg">{frontmatter.summary}</p>
            <p className="text-lg">{timeToRead} min read</p>
            <ShareButtons url={url} />
          </div>
          <span
            className="absolute bottom-0 w-full h-2 header-gradient"
            style={{ filter: "brightness(3)" }}
          ></span>
        </header>
        <div
          className="mt-20 mb-20 blog max-w-[800px] mx-auto max-md:px-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <FeedbackSection slug={frontmatter.slug} />
      </div>
    </Layout>
  );
};

export default BlogPostTemplate;

interface BlogHeadProps extends HeadProps {
  data: {
    markdownRemark: MarkdownRemarkType;
  };
}

export const Head: React.FC<BlogHeadProps> = ({
  location,
  params,
  data,
  pageContext,
}) => {
  const { markdownRemark } = data;
  const frontmatter = markdownRemark?.frontmatter;
  const cover = frontmatter?.cover?.childImageSharp?.gatsbyImageData;
  const wordCount = markdownRemark?.wordCount?.words;
  const timeToRead = markdownRemark?.timeToRead;

  if (!frontmatter) {
    return null;
  }

  const url = Constants.DOMAIN + "/blog/" + frontmatter?.slug;

  const microdata = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    image: "https://" + Constants.DOMAIN + cover.images.fallback.src,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: {
      "@type": "Person",
      name: "Saiid El Hajj Chehade",
    },
    publisher: {
      "@type": "Organization",
      name: "Saiid's Blog",
      logo: {
        "@type": "ImageObject",
        url: "https://" + Constants.DOMAIN + "/favicon-32x32.png",
      },
    },
    description: frontmatter.summary,
    mainEntityOfPage: url,
    url: url,
    articleSection: frontmatter.tags.join(", "),
    keywords: frontmatter.tags.join(", "),
    wordCount: wordCount,
    timeRequired: timeToRead + "M",
    isAccessibleForFree: true,
    hasPart: {
      "@type": "WebPageElement",
      isAccessibleForFree: true,
    },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(microdata)}</script>
      <title>{frontmatter.title} | Saiid's Blog</title>
      <meta name="description" content={frontmatter.summary} />
      <meta name="keywords" content={frontmatter.tags.join(", ")} />
      <meta
        property="og:image"
        content={"https://" + Constants.DOMAIN + cover.images.fallback.src}
      />

      <meta property="og:title" content={frontmatter.title} />
      <meta property="og:description" content={frontmatter.summary} />
      <meta property="og:url" content={location.pathname} />
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={frontmatter.date} />
      <meta property="article:author" content="Saiid El Hajj Chehade" />
      <meta property="article:section" content="Technology" />

      <meta property="article:tag" content="Technology" />
      <meta property="article:tag" content="Software Engineering" />
      <meta property="article:tag" content="Web Development" />
      <meta property="article:tag" content="Programming" />
      {frontmatter.tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content="@saiidchehade" />
      <meta name="twitter:title" content={frontmatter.title} />
      <meta name="twitter:description" content={frontmatter.summary} />
      <meta name="twitter:url" content={location.pathname} />
      <meta name="twitter:label1" content="Written by" />
      <meta name="twitter:data1" content="Saiid El Hajj Chehade" />
      <meta name="twitter:label2" content="Filed under" />
      <meta name="twitter:data2" content={frontmatter.tags.join(", ")} />
      <meta name="twitter:site" content="@saiid_hc" />
      <meta
        name="twitter:image"
        content={"https://" + Constants.DOMAIN + cover.images.fallback.src}
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image:alt" content={frontmatter.title} />
    </>
  );
};

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }, fileAbsolutePath: { regex: "/_blogs/" }) {
      html
      frontmatter {
        date(formatString: "DD MMM YYYY")
        slug
        title
        tags
        summary
        cover {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      timeToRead
      excerpt
      wordCount {
        words
      }
    }
  }
`;
