import * as React from "react";

export const SEO: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      {children}

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/favicon.ico" />

      <title>saiid.ch</title>
      <meta
        name="description"
        content="Saiid El Hajj Chehade's personal website"
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
