import React, { useState } from "react";
import { Tooltip } from "flowbite-react";

// Components
import Modal, { ModalProps } from "../Modal";
import Button from "../Button";

// Hooks
import { useWindowDimensions, useActions } from "../../hooks";

// Types
import { Status } from "../../redux/actions/loader";

// Operations
import { updateTip, addCredits, withdrawCredits, removeTask } from "../../operations/tasks";

// Globals
import { bcdURL, explorerURL } from "../../common/global";

interface TaskCardProps {
  owner: string;
  contract: string;
  entrypoint: string;
  tip: string;
  creditsRemaining: string;
  estimatedFee: string;
  lastExecuted: string;
  metadata: string;
  isYour?: boolean;
}

const TaskCard = ({
  owner,
  contract,
  entrypoint,
  tip,
  creditsRemaining,
  estimatedFee,
  lastExecuted,
  metadata,
  isYour = false,
}: TaskCardProps) => {
  const [modal, setModal] = useState<ModalProps>({
    show: false,
    heading: "",
    label: "",
    icon: "",
    value: "",
    error: false,
    placeholder: "",
    onChange: () => true,
    onSubmit: () => true,
    onClose: () => true,
  });
  const [modalInputValue, setModalInputValue] = useState<string>("");
  const [modalError, setModalError] = useState<boolean>(false);

  const { setLoader } = useActions();

  const { width } = useWindowDimensions();

  // Modal openers
  const openUpdateTipModal = () => {
    setModal({
      show: true,
      heading: "Update Tip",
      label: "Tip/Task",
      icon: "cash-coin",
      value: "",
      error: false,
      placeholder: "Amount of SZL",
      onChange: (val: string) => setModalInputValue(val),
      onSubmit: onUpdateTip,
      onClose: () => {
        setModal({ ...modal, show: false });
        setModalError(false);
        setModalInputValue("");
      },
    });
  };

  const openAddCreditsModal = () => {
    setModal({
      show: true,
      heading: "Add Credits",
      label: "Credits to Add",
      icon: "credit-card-2-back",
      value: "",
      error: false,
      placeholder: "Amount of SZL",
      onChange: (val: string) => setModalInputValue(val),
      onSubmit: onAddCredits,
      onClose: () => {
        setModal({ ...modal, show: false });
        setModalError(false);
        setModalInputValue("");
      },
    });
  };

  const openWithdrawCreditsModal = () => {
    setModal({
      show: true,
      heading: "Withdraw Credits",
      label: "Credits to Withdraw",
      icon: "wallet",
      value: "",
      error: false,
      placeholder: "Amount of SZL",
      onChange: (val: string) => setModalInputValue(val),
      onSubmit: onWithdrawCredits,
      onClose: () => {
        setModal({ ...modal, show: false });
        setModalError(false);
        setModalInputValue("");
      },
    });
  };

  // Operation utilities
  const onUpdateTip = async (value: string) => {
    try {
      // Error check
      const numVal = parseFloat(value);
      if (Number.isNaN(numVal) || numVal === 0) {
        setModalError(true);
        return;
      }

      setLoader(Status.LOADING, "Updating tip...");

      setModal({ ...modal, show: false });
      setModalError(false);

      await updateTip(contract, value);

      setLoader(Status.SUCCESS, "Tip updated succesfully!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  const onAddCredits = async (value: string) => {
    try {
      // Error check
      const numVal = parseFloat(value);
      if (Number.isNaN(numVal) || numVal === 0) {
        setModalError(true);
        return;
      }

      setLoader(Status.LOADING, "Adding credits...");

      setModal({ ...modal, show: false });
      setModalError(false);

      await addCredits(contract, value);

      setLoader(Status.SUCCESS, "Credits added succesfully!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  const onWithdrawCredits = async (value: string) => {
    try {
      // Error check
      const numVal = parseFloat(value);
      if (Number.isNaN(numVal) || numVal === 0) {
        setModalError(true);
        return;
      }

      setLoader(Status.LOADING, "Withdrawing credits...");

      setModal({ ...modal, show: false });
      setModalError(false);

      await withdrawCredits(contract, value);

      setLoader(Status.SUCCESS, "Credits withdrawn succesfully!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  const onRemoveTask = async () => {
    try {
      setLoader(Status.LOADING, "Removing task...");

      await removeTask(contract);

      setLoader(Status.SUCCESS, "Credits withdrawn succesfully!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  return (
    <div className="bg-card shadow-sm py-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <i className="text-icon text-lg bi bi-wallet-fill" />
            <a href={`${explorerURL}/${owner}`} target="_blank" rel="noreferrer">
              <span className="text-secondary font-semibold ml-2 hover:underline cursor-pointer">
                {width < 1280 ? `${owner.slice(0, 5)}...${owner.slice(-2)}` : owner}
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <i className="text-icon text-lg bi bi-file-earmark-code-fill" />
            <a
              href={`${bcdURL}/${contract}/interact/${entrypoint}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="text-secondary font-semibold ml-2 hover:underline cursor-pointer">
                {width < 1280 ? `${contract.slice(0, 5)}...${contract.slice(-2)}` : contract}
              </span>
            </a>
          </div>
        </div>
        <a href={metadata} target="_blank" rel="noreferrer">
          <Tooltip content="View Metadata" className="rounded-t-none rounded-b-none">
            <i className="bi bi-info-circle-fill text-xl text-info cursor-pointer"></i>
          </Tooltip>
        </a>
      </div>
      {/* Divider */}
      <div className="bg-label opacity-20 h-0.5" />
      {/* Details */}
      <div className="grid grid-cols-2 lg:grid-cols-5 py-3 gap-y-3 font-medium">
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Entrypoint</span>
          <span>{entrypoint}</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">
            Estimated Fee{" "}
            <Tooltip content="Based on last execution" className="rounded-t-none rounded-b-none">
              <i className="bi bi-info-circle-fill text-sm opacity-70 cursor-pointer"></i>
            </Tooltip>
          </span>
          <span>{estimatedFee}</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Tip</span>
          <span>{tip} SZL</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Credits Remaining</span>
          <span>{creditsRemaining} SZL</span>
        </div>
        <div className="flex flex-col items-center gap-y-2 col-span-2 lg:col-span-1">
          <span className="text-label">Last Executed</span>
          <span>{lastExecuted || "-"}</span>
        </div>
      </div>
      {isYour && (
        <React.Fragment>
          {/* Divider */}
          <div className="bg-label opacity-20 h-0.5" />
          {/* Actions */}
          <div className="grid sm:inline-grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 pt-2">
            <Button onClick={openUpdateTipModal}>
              <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
                <i className="bi bi-cash-coin" />
                Update Tip
              </div>
            </Button>
            <Button onClick={openAddCreditsModal}>
              <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
                <i className="bi bi-credit-card-2-back" />
                Add Credits
              </div>
            </Button>
            <Button onClick={openWithdrawCreditsModal}>
              <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
                <i className="bi bi-wallet" />
                Withdraw Credits
              </div>
            </Button>
            <Button onClick={onRemoveTask}>
              <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
                <i className="bi bi-x-square" />
                Remove Task
              </div>
            </Button>
          </div>
        </React.Fragment>
      )}
      {/* Modals */}
      <Modal {...modal} error={modalError} value={modalInputValue} />
    </div>
  );
};

export default TaskCard;
