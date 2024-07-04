import React from "react";

type HeadingProps = {
  name: string;
};

export const Heading: React.FC<HeadingProps> = ({ name }) => {
  return (
    <span className="">
      <span className="absolute w-screen h-10 gradient-overlay-2 z-20 left-0" />
      <h1 className="text-4xl text-base-content font-mono">
        GET <b>{name}</b>
      </h1>
    </span>
  );
};
