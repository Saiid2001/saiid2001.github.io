import { StaticImage } from "gatsby-plugin-image";
import React from "react";
import GithubLogo from "../images/svg/github-logo.svg";
import LinkedInLogo from "../images/svg/linkedin-logo.svg";
import XLogo from "../images/svg/x-logo.svg";
import ScholarLogo from "../images/svg/scholar-logo.svg";

type SocialButtonProps = {
  className: string;
};

const SocialButtons: React.FC<SocialButtonProps> = ({ className }) => {
  return (
    <div className={className}>
      <a href="#" className="btn  btn-secondary btn-square">
        <LinkedInLogo className="h-10 w-10 p-1 rounded opacity-50" />
      </a>
      <a href="#" className="btn btn-secondary  btn-square">
        <GithubLogo className="h-10 w-10 p-2 rounded opacity-50" />
      </a>
      <a href="#" className="btn btn-secondary btn-square">
        <ScholarLogo className="h-10 w-10 p-1 rounded opacity-50" />
      </a>
      <a href="#" className="btn  btn-secondary btn-square">
        <XLogo className="h-10 w-10 p-2 rounded opacity-50" />
      </a>
    </div>
  );
};

export const Banner: React.FC = () => {
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
            <p className="mb-5">
              I am a PhD candidate at SPRING Lab in EPFL, Switzerland. I focus
              on web privacy and security research. I am interested in finding
              more robust tools to study the opaque web ecosystem! Can we
              automate security and privacy analysis further?Clean code
              proponent and full-stack development enthusiast. Artistically
              inspired across mediums.
            </p>
            <p>
              Clean code proponent and full-stack development enthusiast.
              Artistically inspired across mediums.
            </p>

            <a
              className="btn btn-secondary btn-outline my-10"
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
