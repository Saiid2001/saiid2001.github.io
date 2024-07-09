import * as React from "react";
import Layout from "../sections/layout";
import { PageProps } from "gatsby";
import { Heading } from "../components/heading";
import { SEO } from "../components/seo";

export const ProjectsSection: React.FC<PageProps> = (props) => {
  return (
    <Layout {...props}>
      <div className="flex flex-col items-center justify-center w-full h-full mt-32">
        <Heading name="Projects"></Heading>
        <p className="mt-4 h-full w-full text-center text-2xl">
          Coming soon...
        </p>
      </div>
    </Layout>
  );
};
export default ProjectsSection;

export const Head: React.FC = () => (
  <SEO>
    <title>saiid.ch | Projects</title>
    <meta name="description" content="Projects" />
    <meta name="keywords" content="Projects" />
    <meta property="og:title" content="Projects" />
    <meta property="og:description" content="Projects" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Projects" />
    <meta name="twitter:description" content="Projects" />
  </SEO>
);
