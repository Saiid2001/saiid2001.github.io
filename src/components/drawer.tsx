import * as React from "react";
import { PropsWithChildren } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Drawer: React.FC<PropsWithChildren<DrawerProps>> = ({
  isOpen,
  onClose,
  children,
}) => {


  // make it slide from the left
  const className = isOpen
    ? "transform translate-x-0"
    : "transform -translate-x-full";


  return (
    <div
      className={
        "fixed top-0 left-0 w-64 h-full bg-base-100 border-r-2 border-r-secondary z-50 shadow-lg transition-transform duration-300 " +
        className
      }
    >
      <div className="flex justify-end p-4">
        <button onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-base-content"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};
