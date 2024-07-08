import { graphql, useStaticQuery } from "gatsby";
import { IndexSection } from "../components/IndexSection";
import * as React from "react";
import { TopicHeading } from "../components/heading";
import Constants from "../utils/constants";
import { StaticImage } from "gatsby-plugin-image";

const Subtopic: React.FC<{
  title: string;
  description: string;
  icon: string;
}> = ({ title, description, icon }) => {
  const Icon = Constants.ICONS[icon as keyof typeof Constants.ICONS];

  return (
    <div className="flex flex-row items-center space-x-4 text-secondary bg-secondary/10 border-4 border-secondary rounded cursor-pointer">
      <div className="h-20 w-20  bg-secondary flex items-center justify-center">
        <Icon className="h-10 w-10 " />
      </div>
      <div>
        <h3 className="text-lg uppercase font-normal">{title}</h3>
      </div>
    </div>
  );
};

const Project: React.FC<{
  title: string;
  description: string;
  year: string;
  url: string;
  code_url: string;
  subtopics: string;
  finished: boolean;
}> = ({ title, description, year, url, code_url, subtopics, finished }) => {
  const _subtopics = subtopics.split(",");
  return (
    <div className="flex flex-row items-center justify-between space-x-4 bg-secondary/10 border-4 border-secondary rounded cursor-default p-4">
      <div>
        <div className="flex flex-row items-center space-x-1">
          <h3 className="text-xl uppercase font-normal text-secondary">
            {title}
          </h3>
          {finished && (
            <StaticImage
              src="../images/verified.png"
              alt="Badge"
              className="h-5 w-5"
              style={{
                filter:
                  "invert(47%) sepia(78%) saturate(2576%) hue-rotate(344deg) brightness(90%) contrast(97%)",
              }}
            />
          )}
        </div>

        <p>{description}</p>
        <p>{year}</p>
        {_subtopics.map((subtopic: string, index: number) => (
          <span key={index} className="text-xs bg-secondary/20 p-1 rounded">
            {subtopic}
          </span>
        ))}
      </div>
      <div className="flex flex-col space-y-4">
        <a href={url}>
          <Constants.ICONS.SCHOLAR
            className="h-10 w-10"
            style={{
              filter:
                "invert(47%) sepia(78%) saturate(2576%) hue-rotate(344deg) brightness(90%) contrast(97%)",
            }}
          />
        </a>
        <a href={code_url}>
          <Constants.ICONS.GITHUB
            className="h-10 w-10"
            style={{
              filter:
                "invert(47%) sepia(78%) saturate(2576%) hue-rotate(344deg) brightness(90%) contrast(97%)",
            }}
          />
        </a>
      </div>
    </div>
  );
};

export const Research: React.FC = () => {
  const data = useStaticQuery(graphql`
    query ResearchQuery {
      researchYaml {
        topic
        supervisor {
          name
          title
          website
        }
        subtopics {
          description
          icon
          title
        }
      }

      allReference(
        filter: { finished: {}, favorite: { eq: "1" } }
        sort: { year: ASC }
      ) {
        nodes {
          raw
          title: shorttitle
          description: shortdescription
          year
          finished
          subtopics
          url
          code_url
        }
      }
    }
  `);

  const { topic, supervisor, subtopics } = data.researchYaml;
  const { nodes: projects } = data.allReference;

  return (
    <IndexSection title="/research">
      <div className="mt-8">
        <TopicHeading name={"/research/advisor"} />
        <p>
          Working under the supervision of{" "}
          <a href={supervisor.website}>
            {supervisor.title} {supervisor.name}
          </a>
        </p>

        <TopicHeading name={"/research/interests"} className="mt-4" />
        <p>
          I am mainly interested in investigating the realm of {topic} and I
          regularly poke the following components
        </p>
        <div className="grid grid-cols-4 space-x-4 my-8">
          {subtopics.map((subtopic: any, index: number) => (
            <Subtopic key={index} {...subtopic} />
          ))}
        </div>

        <TopicHeading name={"/research/projects"} className="mt-12" />
        <p>Here is a highlight of my most interesting projects</p>

        <div className="grid grid-cols-4 space-x-4 my-8">
          {projects.map((node: any, index: number) => (
            <Project key={index} {...node} />
          ))}
          <a
            href="/publications"
            className="text-secondary font-mono hover:underline"
          >
            <Constants.ICONS.DOWN_ARROW
              className="h-3 w-3 -rotate-90 inline"
              style={{
                filter:
                  "invert(47%) sepia(78%) saturate(2576%) hue-rotate(344deg) brightness(90%) contrast(97%)",
              }}
            />{" "}
            view all publications
          </a>
        </div>
      </div>
    </IndexSection>
  );
};
