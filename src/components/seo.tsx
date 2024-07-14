import * as React from "react";

export const SEO: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      {children}

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
    </>
  );
};
