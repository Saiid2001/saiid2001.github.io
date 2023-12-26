import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from "@fortawesome/free-solid-svg-icons";

const Header: React.FC = () => {
  return (
    <header className="p-4 flex w-full justify-between items-center">
      <h1 className="font-bold text-primary">SAIID</h1>
      <nav className="flex gap-4 items-center">
        <a className="btn btn-ghost">Home</a>
        <a className="btn btn-ghost">Blog</a>
        <a className="btn btn-ghost">Projects</a>
        <a className="btn btn-ghost">Publications</a>
      </nav>
      <div className="flex gap-2">
      <button className="btn btn-ghost rounded-full">
          <FontAwesomeIcon icon={faSun} />
        </button>
        <button className="btn btn-primary">Download CV</button>
        
      </div>
    </header>
  );
};

export default Header;
