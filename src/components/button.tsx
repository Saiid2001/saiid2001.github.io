import * as React from "react";

// styles
import "../styles/button.css";
import Icon from "../images/svg/down_arrow.svg";

type ButtonProps = {
  onClick?: () => void;
};

type LogoButtonProps = ButtonProps & {
  logo: string;
};

export const LogoButton: React.FC<LogoButtonProps> = (props) => {
  const [mouseX, setMouseX] = React.useState<number>(0);
  const [mouseY, setMouseY] = React.useState<number>(0);
  const elemRef = React.useRef<HTMLButtonElement>(null);
  // update mouse position
  const updateMouse = (e: MouseEvent) => {
    if (!elemRef.current) {
      return;
    }

    const rect = elemRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMouseX(x);
    setMouseY(y);
  };

  // add event listener
  React.useEffect(() => {
    window.addEventListener("mousemove", updateMouse);
    return () => {
      window.removeEventListener("mousemove", updateMouse);
    };
  }, []);

  // add styles --mouse-x and --mouse-y to button
  const buttonStyle = {
    "--mouse-x": mouseX + "px",
    "--mouse-y": mouseY + "px",
    "--logo": "var(--" + props.logo + "-logo)",
  } as React.CSSProperties;

  return (
    <button className="hover-button" style={buttonStyle} ref={elemRef}>
      <span></span>
    </button>
  );
};

export const TextButton: React.FC<React.PropsWithChildren<ButtonProps>> = (
  props
) => {
  return (
    <button className="text-button" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export const IconAndTextButton: React.FC<
  React.PropsWithChildren<ButtonProps & { icon: any; accent?: boolean }>
> = (props) => {
  return (
    <button
      className={
        "group font-bold font-mono btn btn-outline btn-sm p-0 pr-2 pointer-events-auto " +
        (props.accent
          ? "text-secondary-light hover:bg-base-100 hover:text-base-content"
          : "bg-secondary/5 text-secondary ")
      }
      onClick={props.onClick}
    >
      <span
        className={
          "w-7 h-full  flex items-center justify-center " +
          (props.accent
            ? "bg-secondary-light group-hover:bg-secondary"
            : "bg-secondary group-hover:bg-secondary-light")
        }
      >
        <props.icon className="w-full -translate-x-[1px]" />
      </span>
      <span>{props.children}</span>
    </button>
  );
};
