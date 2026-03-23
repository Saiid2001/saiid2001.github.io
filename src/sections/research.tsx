import * as React from "react";
import Constants from "../utils/constants";
import type { Publication } from "../lib/parse-bibtex";

interface ResearchData {
  supervisor: { title: string; name: string; website: string };
  topic: string;
  subtopics: { title: string; key: string; description: string; icon: string }[];
}

const TopicHeading: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  return <h2 className={"text-secondary font-mono " + className}>{name}</h2>;
};

const VENUE_ABBREVS: Record<string, string> = {
  "USENIX Security Symposium": "USENIX Sec",
  "IEEE Symposium on Security and Privacy": "IEEE S&P",
};

function abbreviateVenue(booktitle: string): string {
  const cleaned = booktitle
    .replace(/\{|\}/g, '')
    .replace(/^\d{4}\s*/, '')
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .trim();
  return VENUE_ABBREVS[cleaned] || cleaned;
}

const Project: React.FC<{
  title: string;
  description: string;
  year: string;
  url: string;
  code_url: string;
  subtopics: string;
  finished: boolean;
  booktitle: string;
}> = ({ title, description, year, url, code_url, subtopics, finished, booktitle }) => {
  const _subtopics = subtopics.split(",");
  const venue = abbreviateVenue(booktitle);

  return (
    <div className="flex flex-col bg-secondary/10 border-2 border-secondary/40 rounded p-4 hover:border-secondary hover:shadow-lg transition-all gap-y-2">
      <div className="flex flex-row items-center gap-x-1.5 flex-wrap">
        <h3 className="text-lg uppercase font-semibold text-secondary">
          {title}
        </h3>
        {finished && (
          <svg className="h-4 w-4 text-secondary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      {venue && (
        <span className="text-xs bg-secondary text-white px-2 py-0.5 rounded font-mono w-fit">
          {venue}
        </span>
      )}
      <p className="text-sm">{description}</p>
      <div className="flex flex-row items-center gap-x-3 mt-auto pt-2 border-t border-secondary/20">
        <span className="text-xs text-base-content/50">{year}</span>
        {_subtopics.map((subtopic: string, index: number) => (
          <span key={index} className="text-xs text-base-content/50">
            {subtopic}
          </span>
        ))}
        <span className="grow" />
        {!!url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary hover:underline font-mono">
            paper
          </a>
        )}
        {!!code_url && (
          <a href={code_url} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary hover:underline font-mono">
            code
          </a>
        )}
      </div>
    </div>
  );
};

const NavigationLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  return (
    <a href={to} className="text-secondary font-mono hover:underline">
      <Constants.ICONS.DOWN_ARROW className="h-3 w-3 -rotate-90 inline text-secondary" />{" "}
      {children}
    </a>
  );
};

export const Research: React.FC<{
  research: ResearchData;
  projects: Publication[];
}> = ({ research, projects }) => {
  const { topic, supervisor, subtopics } = research;

  return (
    <div className="mt-8">
      <p className="mb-6 max-w-[800px] border-l-2 border-muted/40 pl-4 text-muted italic">
        The modern web is a complex ecosystem where browsers, servers, and extensions interact in ways
        that create unexpected privacy and security risks. My research systematically investigates each
        of these layers, building automated tools that can study the opaque web ecosystem at scale.
      </p>

      <TopicHeading name={"/research/advisor"} />
      <p>
        Working under the supervision of{" "}
        <a href={supervisor.website}>
          {supervisor.title} {supervisor.name}
        </a>
      </p>

      <TopicHeading name={"/research/interests"} className="mt-4" />
      <p>
        I am mainly interested in investigating the realm of {topic}, focusing on{" "}
        {subtopics.map((subtopic: any, index: number) => (
          <span key={index} className="inline-flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-0.5 rounded font-mono text-sm mx-0.5">
            {(() => {
              const Icon = Constants.ICONS[subtopic.icon as keyof typeof Constants.ICONS];
              return Icon ? <Icon className="h-3.5 w-3.5 inline" /> : null;
            })()}
            {subtopic.title}
          </span>
        ))}
      </p>

      <TopicHeading name={"/research/projects"} className="mt-8" />
      <p>Here is a highlight of my most interesting projects</p>

      <div className="grid grid-cols-4 gap-4 my-8 max-lg:grid-cols-2 max-md:grid-cols-1">
        {projects.map((node, index) => (
          <Project
            key={index}
            title={node.shorttitle}
            description={node.shortdescription}
            year={node.year}
            url={node.url}
            code_url={node.code_url}
            subtopics={node.subtopics}
            finished={node.finished}
            booktitle={node.booktitle}
          />
        ))}
        <NavigationLink to="/publications">view all publications</NavigationLink>
      </div>
    </div>
  );
};
