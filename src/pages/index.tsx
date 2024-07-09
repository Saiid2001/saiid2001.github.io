import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../sections/layout";
import info from "../data/info.json";
import { graphql } from "gatsby";
import { Banner } from "../sections/banner";
import { News } from "../sections/news";
import { Research } from "../sections/research";
import { SEO } from "../components/seo";


const IndexPage: React.FC<PageProps> = (props) => {
  const [theme, setTheme] = React.useState<string | undefined>(undefined);

  return (
    <Layout
      {...props}
      hideHeaderOnScroll
      theme={theme}
      onToggleTheme={setTheme}
    >
      <Banner theme={theme} onToggleTheme={setTheme} />
      <News />
      <Research />
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <SEO></SEO>;
