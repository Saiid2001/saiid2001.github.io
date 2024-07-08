import { StaticImage } from "gatsby-plugin-image";
import React from "react";

import { graphql, useStaticQuery } from "gatsby";
import Constants from "../utils/constants";

type SocialButtonProps = {
  className: string;
};

const SocialButtons: React.FC<SocialButtonProps> = ({ className }) => {
  return (
    <div className={className}>
      <a
        href="https://www.linkedin.com/in/saiid-hc/"
        className="btn  btn-secondary btn-square"
      >
        <Constants.ICONS.LINKEDIN className="h-10 w-10 p-1 rounded opacity-50" />
      </a>
      <a
        href="https://github.com/Saiid2001"
        className="btn btn-secondary  btn-square"
      >
        <Constants.ICONS.GITHUB className="h-10 w-10 p-2 rounded opacity-50" />
      </a>
      <a
        href="https://scholar.google.com/citations?user=gF0rvJAAAAAJ&hl=en"
        className="btn btn-secondary btn-square"
      >
        <Constants.ICONS.SCHOLAR className="h-10 w-10 p-1 rounded opacity-50" />
      </a>
      <a
        href="https://x.com/saiid_hc"
        className="btn  btn-secondary btn-square"
      >
        <Constants.ICONS.X className="h-10 w-10 p-2 rounded opacity-50" />
      </a>
    </div>
  );
};

export const Banner: React.FC = () => {
  const data = useStaticQuery(graphql`
    query BannerQuery {
      markdownRemark(fileAbsolutePath: { regex: "/summary.md/" }) {
        html
      }
    }
  `);

  const summary = data.markdownRemark.html;

  return (
    <section className="relative w-full ">
      <div className="gradient-overlay-2 absolute left-0 top-0 h-full w-80 z-0" />
      <div className="relative pt-20 flex flex-row space-x-12 justify-between pl-32 z-20 ">
        <section className="w-96">
          <h1 className="font-bold font-mono text-4xl mb-10">
            SAIID EL HAJJ CHEHADE
          </h1>

          <div className="relative">
            <SocialButtons className="flex flex-col items-center space-y-2 absolute -left-16" />
            <div
              className="space-y-4"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
            <a
              className="btn btn-secondary btn-outline my-10 w-full"
              href="mailto:saiid.elhajjchehade@epfl.ch"
            >
              EMAIL saiid.elhajjchehade@epfl.ch
            </a>
          </div>
        </section>
        <div className="relative">
          <StaticImage
            src="../images/profile.png"
            alt="Profile picture"
            className="min-h-72 h-full"
          />
          <div className="gradient-overlay absolute w-full h-full top-0 left-0"></div>
        </div>
      </div>
    </section>
  );
};
