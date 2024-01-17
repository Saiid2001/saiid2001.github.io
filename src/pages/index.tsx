import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPhone, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin , faGoogleScholar, faXTwitter} from "@fortawesome/free-brands-svg-icons";
import ReactMarkdown from "react-markdown";
import Img from 'gatsby-image';
import Layout from "../components/layout";
import info from "../data/info.json";
import LatestNews from "../components/latestNews";
import { graphql } from "gatsby"


const IndexPage: React.FC<PageProps> = (props) => {
  return (
    <Layout {...props}>
      {/* PROFILE CARD */}
      <section className="flex w-full px-8 relative">
        {/* IMAGE */}
        <div className="bg-primary/10 w-2/6 flex pr-12 flex-row-reverse rounded-lg arabeque-bg overflow-hidden items-center">
          <Img fixed={props.data.file.childImageSharp.fixed} 

          className=" rounded-lg edges-blur absolute -bottom-9"/>
          {/* <img className="bg-black w-60 h-full min-h-60 rounded-lg"></img> */}
        </div>
        {/* MAIN INFO */}
        <div className="w-4/6 p-8 bg-gradient-to-l from-primary/10 to-transparent rounded-lg">
          <p>Hello, I'm</p>
          <h1 className="font-bold text-2xl mb-4">SAIID EL HAJJ CHEHADE</h1>

          <ReactMarkdown children={info.shortBio}/>

          <div className="mt-4">
            <a className="btn btn-secondary">
              <FontAwesomeIcon icon={faPaperPlane} /> Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL SECTION */}
      <section className="flex w-full gap-4 px-8 mt-4 max-2xl:flex-col">
        <div className="w-4/6 max-2xl:w-full flex flex-col gap-4 max-2xl:flex-row max-md:flex-col">
          {/* SOCIAL MEDIA BUTTONS */}
          <div className="grid grid-cols-4 gap-2 max-2xl:grid-rows-4 max-2xl:grid-cols-none max-md:grid-cols-4 max-md:grid-rows-none">
            <a className="btn w-full max-2xl:h-full max-2xl:flex-col">
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>
            <a className="btn w-full max-2xl:h-full max-2xl:flex-col">
              <FontAwesomeIcon icon={faGithub} /> Github
            </a>
            <a className="btn w-full max-2xl:h-full max-2xl:flex-col">
              <FontAwesomeIcon icon={faGoogleScholar} /> Scholar
            </a>
            <a className="btn w-full max-2xl:h-full max-2xl:flex-col">
              <FontAwesomeIcon icon={faXTwitter} /> X
            </a>
          </div>

          {/* CURRENT OCCUPATION */}
          <div className=" bg-primary/10 flex flex-row justify-between rounded-lg relative">

            <div className="p-8">
              <p>Currently I am a</p>
              <h1 className="text-2xl">{info.occupation.title} at <a className="text-primary font-bold" href={info.occupation.institutionWebsite}>{info.occupation.institution}</a></h1>
              <ReactMarkdown children={info.occupation.description} className={"mt-2"}/>
              {/* ADDRESS */}
              <div className="mt-2 flex justify-between">
                <section>
                <h2 className="font-bold text-primary">Address</h2>
                {info.occupation.address.map((address, index) => (
                  <p key={index} className="text-sm">{address}</p>
                ))}
                </section>
                <section className="flex flex-col">
                <h2 className="font-bold text-primary">Contact</h2>
                  <a className="btn btn-ghost btn-sm justify-start" href={"tel:"+info.occupation.phone}>
                    <FontAwesomeIcon icon={faPhone} />
                    {info.occupation.phone}</a>
                  <a className="btn btn-ghost btn-sm justify-start" href={"mailto:"+info.occupation.email}>
                  <FontAwesomeIcon icon={faEnvelope} />
                    {info.occupation.email}</a>
                  <a className="btn btn-ghost btn-sm justify-start" href={info.occupation.profileWebsite}>
                  <FontAwesomeIcon icon={faUser} />
                    {info.occupation.institution} Profile</a>
                </section>
              </div>
            </div>

            <img src={info.occupation.image} className="w-80 object-cover object-bottom rounded-lg max-lg:opacity-10 max-lg:absolute max-lg:-z-10 max-lg:left-0 max-lg:top-0 max-lg:h-full max-lg:w-full"/>
            
          </div>
        </div>
        <div className="w-2/6 max-2xl:w-full">
          <LatestNews/>
        </div>
      </section>
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
        fixed(height: 300, ) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;