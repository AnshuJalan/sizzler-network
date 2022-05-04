import { ReactNode } from "react";

interface IButton {
  onClick: () => void;
  children: ReactNode;
  outline?: boolean;
  disabled?: boolean;
}

const Button = ({ onClick, children, outline = false, disabled = false }: IButton) => {
  return !disabled ? (
    <div
      onClick={onClick}
      className={`flex justify-center items-center font-semibold ${
        outline ? "ring-1 ring-secondary text-secondary" : "bg-secondary text-white"
      }  hover:opacity-80 transition-opacity duration-200 cursor-pointer shadow-sm`}
    >
      {children}
    </div>
  ) : (
    <div
      className={`flex justify-center items-center font-semibold opacity-70 ${
        outline ? "ring-1 ring-gray-400 text-gray-400" : "bg-gray-400 text-white"
      } shadow-sm`}
    >
      {children}
    </div>
  );
};

export default Button;
