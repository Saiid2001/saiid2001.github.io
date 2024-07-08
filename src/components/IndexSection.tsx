import * as React from "react";
import { Heading } from "./heading";

type IndexSectionProps = {
  title: string;
  className?: string;
};

export const IndexSection: React.FC<
  React.PropsWithChildren<IndexSectionProps>
> = (props) => {
  return (
    <div
      className={
        "flex flex-col items-left pl-32 my-10 w-full pr-8 " + props.className
      }
    >
      <Heading name={props.title} />
      {props.children}
    </div>
  );
};
