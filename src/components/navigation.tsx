import * as React from "react";
import Constants from "../utils/constants";

export const NavigationLink: React.FC<{
  to: string;
  children: React.ReactNode;
}> = ({ to, children }) => {
  return (
    <a href={to} className="text-secondary font-mono hover:underline">
      <Constants.ICONS.DOWN_ARROW
        className="h-3 w-3 -rotate-90 inline"
        style={{
          filter:
            "invert(47%) sepia(78%) saturate(2576%) hue-rotate(344deg) brightness(90%) contrast(97%)",
        }}
      />{" "}
      {children}
    </a>
  );
};
