import { ReactNode } from "react";

interface IButton {
  onClick: () => void;
  children: ReactNode;
}

const Button = ({ onClick, children }: IButton) => {
  return (
    <div
      onClick={onClick}
      className="flex justify-center items-center font-semibold bg-secondary text-white hover:opacity-80 transition-opacity duration-200 cursor-pointer"
    >
      {children}
    </div>
  );
};

export default Button;
