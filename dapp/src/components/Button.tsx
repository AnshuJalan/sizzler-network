import { ReactNode } from "react";

interface IButton {
  onClick: () => void;
  children: ReactNode;
  outline?: boolean;
}

const Button = ({ onClick, children, outline = false }: IButton) => {
  return (
    <div
      onClick={onClick}
      className={`flex justify-center items-center font-semibold ${
        outline ? "ring-1 ring-secondary text-secondary" : "bg-secondary text-white"
      }  hover:opacity-80 transition-opacity duration-200 cursor-pointer shadow-sm`}
    >
      {children}
    </div>
  );
};

export default Button;
