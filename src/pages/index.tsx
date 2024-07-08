import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../sections/layout";
import info from "../data/info.json";
import { graphql } from "gatsby";
import { Banner } from "../sections/banner";
import { News } from "../sections/news";
import { Research } from "../sections/research";

const IndexPage: React.FC<PageProps> = (props) => {
  return (
    <Layout {...props}>
      <Banner />
      <News />
      <Research />
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Saiid El Hajj Chehade</title>;

export const query = graphql`
  query {
    file(relativePath: { eq: "profile-picture.png" }) {
      childImageSharp {
        # Specify the image processing specifications right in the query.
        # Makes it trivial to update as your page's design changes.
        fixed(height: 300) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;
