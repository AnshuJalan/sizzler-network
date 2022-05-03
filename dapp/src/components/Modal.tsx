import { Fragment, useRef } from "react";

// Components
import Button from "./Button";

export interface IModal {
  show: boolean;
  heading: string;
  icon: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const Modal = ({
  show,
  heading,
  icon,
  label,
  value,
  placeholder,
  onSubmit,
  onChange,
  onClose,
}: IModal) => {
  const ref = useRef<any>();

  const onModalClose = (e: any) => {
    if (e.target === ref.current) {
      onClose();
    }
  };

  return show ? (
    <div
      ref={ref}
      onClick={onModalClose}
      className={`fixed top-0 right-0 z-50 flex flex-col items-center justify-center gap-6 h-screen w-full bg-overlay bg-opacity-90`}
    >
      {/* Card */}
      <div className="bg-card w-10/12 md:w-1/3 animate-fadeInDown">
        {/* Header */}
        <div className="flex flex-col items-center font-semibold bg-secondary text-white">
          <div className="flex flex-col items-center gap-y-2 py-4">
            <i className={`bi bi-${icon} text-4xl`} />
            <span className="text-2xl">{heading}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center px-5 py-3">
          <div className="text-label font-medium self-start mb-1">{label}</div>
          <input
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <div className="mt-6 flex items-center justify-center gap-x-3">
            <Button onClick={onSubmit}>
              <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
                Confirm
              </div>
            </Button>
            <Button onClick={onClose} outline>
              <div className="px-3 py-2 text-sm">Go Back</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Fragment></Fragment>
  );
};

export default Modal;
