import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

type HeaderProps = {
    onToggleTheme: (theme: string) => void, 
    theme: string
}

const Header: React.FC<HeaderProps> = (props) => {

  return (
    <header className="p-8 flex w-full justify-between items-center">
      <h1 className="font-bold text-primary">SAIID</h1>
      <nav className="flex gap-4 items-center justify-center grow">
        <a className="btn btn-ghost">Home</a>
        <a className="btn btn-ghost">Blog</a>
        <a className="btn btn-ghost">Projects</a>
        <a className="btn btn-ghost">Publications</a>
      </nav>
      <div className="flex gap-2">
      
        {props.theme=="dark"?<button className="btn btn-ghost rounded-full" onClick={()=>props.onToggleTheme("light")}>
          <FontAwesomeIcon icon={faSun} />
        </button>
        :<button className="btn btn-ghost rounded-full" onClick={()=>props.onToggleTheme("dark")}>
            <FontAwesomeIcon icon={faMoon} />
        </button>}
        
        <button className="btn btn-primary">Download CV</button>
      </div>
    </header>
  );
};

export default Header;
