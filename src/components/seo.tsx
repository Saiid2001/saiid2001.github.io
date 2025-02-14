import * as React from "react";


const PersonSchema = {
  "@context": "https://schema.org/",
  "@type": "Person",
  "name": "Saiid El Hajj Chehade",
  "url": "https://saiid.ch",
  "image": "https://github.com/Saiid2001/saiid2001.github.io/blob/main/src/images/profile.png?raw=true",
  "sameAs": [
    "https://x.com/saiid_hc",
    "https://www.linkedin.com/in/saiid-hc/",
    "https://github.com/Saiid2001",
    "https://saiid.ch"
  ],
  "jobTitle": "PhD Student",
  "worksFor": {
    "@type": "Organization",
    "name": "EPFL"
  },
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "American University of Beirut"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Station 14",
    "addressLocality": "Lausanne",
    "postalCode": "1015",
    "addressCountry": "Switzerland"
  },
  "email": "saiid.elhajjchehade@epfl.ch",
};

const ProfilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@id": "main-entity",
    ...PersonSchema
  }
};

export const SEO: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      {children}

      <script type="application/ld+json">
        {JSON.stringify(PersonSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(ProfilePageSchema)}
      </script>
      <meta charSet="utf-8" />
      <meta lang="en" />
      <meta name="author" content="Saiid El Hajj Chehade" />
      <meta name="robots" content="index, follow" />
      <meta name="google" content="notranslate" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="saiid.ch" />
      <meta name="application-name" content="saiid.ch" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="canonical" href="https://saiid.ch" />

      <title>Saiid El Hajj Chehade's Personal Website</title>
      <meta
        name="description"
        content="Hi! I am a PhD candidate at SPRING Lab in EPFL, Switzerland 🇨🇭. I focus on web privacy and security research. I also write code for interesting projects. Check my website to know more!"
      />
      <meta
        name="keywords"
        content="Saiid El Hajj Chehade, Saiid Chehade, Saiid, Chehade, SPRING Lab, EPFL, Web Privacy, Web Security, Security, Privcay, Web Research, Web Ecosystem, Research, Computer"
      />
      <meta property="og:title" content="saiid.ch" />
      <meta
        property="og:description"
        content="Saiid El Hajj Chehade's personal website"
      />
      <meta property="og:url" content="https://saiid.ch" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="saiid.ch" />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content="@saiid_hc" />
      <meta name="twitter:title" content="saiid.ch" />
      <meta
        name="twitter:description"
        content="Saiid El Hajj Chehade's personal website"
      />
      <meta name="twitter:url" content="https://saiid.ch" />
      <meta name="twitter:site" content="@saiid_hc" />
      <html lang="en" />
    </>
  );
};
