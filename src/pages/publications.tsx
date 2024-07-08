import { HeadFC, PageProps, graphql } from "gatsby";
import * as React from "react";
import Layout from "../sections/layout";
import { Heading } from "../components/heading";

interface PublicationProps {
  title: string;
  year: string;
  raw: string;
  author: string;
  booktitle: string;
  finished: boolean;
  subtopics: string[];
  url: string;
  code_url: string;
}

const Publication: React.FC<PublicationProps> = (props) => {
  function copy() {
    navigator.clipboard.writeText(props.raw);
  }

  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-2xl font-bold">{props.title}</h1>
      <p className="text-lg">{props.author}</p>
      <p className="text-lg italic">{props.booktitle}</p>
      <details className="flex flex-col space-y-2">
        <summary className="text-lg font-semibold">BibTeX</summary>
        <div className="relative">
          <p className="font-mono text-secondary bg-secondary/20 p-8 pt-12">
            {props.raw}
          </p>
          <button
            className="btn btn-secondary btn-ghost absolute top-0 left-0"
            onClick={copy}
          >
            Copy Bib
          </button>
        </div>
      </details>
    </div>
  );
};

interface PublicationsPageProps extends PageProps {
  data: {
    allReference: {
      nodes: PublicationProps[];
    };
  };
}

const PublicationsPage: React.FC<PublicationsPageProps> = (props) => {
  const publications = props.data.allReference.nodes;

  const groupedByYear = publications.reduce(
    (acc: Record<string, PublicationProps[]>, publication) => {
      const year = publication.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(publication);
      return acc;
    },
    {}
  );

  return (
    <Layout {...props}>
      <div className="mt-32 pl-32 flex flex-col space-y-8">
        {Object.keys(groupedByYear).map((year) => (
          <div key={year} className="flex flex-col space-y-4">
            <Heading name={year} />
            <div className="flex flex-col space-y-4">
              {groupedByYear[year].map((publication) => (
                <Publication key={publication.raw} {...publication} />
              ))}
            </div>
          </div>
        ))}
        
      </div>
    </Layout>
  );
};

export default PublicationsPage;

export const Head: HeadFC = () => (
  <title>Saiid El Hajj Chehade | Publications</title>
);

export const query = graphql`
  query {
    allReference(sort: { date: DESC }) {
      nodes {
        raw
        title
        year
        author
        booktitle
        finished
        subtopics
        url
        code_url
      }
    }
  }
`;
