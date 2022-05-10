import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Parser, emitMicheline } from "@taquito/michel-codec";

interface MetadataProps {
  show: boolean;
  id: string;
  title: string;
  descriptionLink: string;
  lambda: string;
  onClose: () => void;
}

// Proposal metadata modal
const Metadata = ({ show, id, title, descriptionLink, lambda, onClose }: MetadataProps) => {
  const ref = useRef<any>();

  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (show) {
      (async () => {
        const res_ = await axios.get(descriptionLink);
        setDescription(res_.data.description);
      })();
    }
  }, [show, setDescription, descriptionLink]);

  const onMetadataClose = (e: any) => {
    if (ref.current === e.target) {
      onClose();
    }
  };

  const getParsedLambda = () => {
    const parser = new Parser();
    const parsedLambda = parser.parseJSON(JSON.parse(lambda));
    return emitMicheline(parsedLambda, { indent: "   ", newline: "\n" });
  };

  return show ? (
    <div
      ref={ref}
      onClick={onMetadataClose}
      className={`fixed top-0 right-0 z-50 flex flex-col items-center justify-center gap-6 h-screen w-full bg-overlay bg-opacity-90`}
    >
      <div
        style={{ maxHeight: "calc(100vh - 10%)" }}
        className="bg-card w-10/12 md:w-1/2 p-5 pt-1 animate-fadeInDown overflow-x-auto font-medium"
      >
        <span
          onClick={onClose}
          className="text-secondary font-semibold text-sm cursor-pointer hover:opacity-70"
        >
          <i className="bi bi-caret-left-fill" />
          Back
        </span>
        <div className="text-xl mt-3">Proposal #{id}</div>
        <div className="bg-primary p-3 mt-2 whitespace-pre-line">{title}</div>
        <div className="text-xl mt-4">Description</div>
        <div className="bg-primary p-3 mt-2 whitespace-pre-line">{description}</div>
        <div className="text-xl mt-4">Proposal Lambda</div>
        <div className="bg-primary p-3 mt-2 whitespace-pre-wrap">{getParsedLambda()}</div>
      </div>
    </div>
  ) : (
    <React.Fragment></React.Fragment>
  );
};

export default Metadata;
