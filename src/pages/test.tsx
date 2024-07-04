import * as React from "react";
import { PageProps } from "gatsby";
import Layout from "../sections/layout";
import { LogoButton, TextButton } from "../components/button";

const TestPage: React.FC<PageProps> = (props) => {
  return (
    <Layout {...props}>
      <LogoButton logo="github" />
      <LogoButton logo="x" />
      <LogoButton logo="linkedin" />
      <LogoButton logo="scholar" />
      <TextButton>Text Button</TextButton>
    </Layout>
  );
};

export default TestPage;
