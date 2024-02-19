import { ReactNode } from "react";
import ReactModal from "react-modal"; // needed to pass jest tests

interface ModalProps {
  isOpen: boolean;
  toggleOpen: () => void;
  width: string;
  height: string;
  children: ReactNode;
  overlayClickClose?: boolean;
}

export default function BaseModal({
  isOpen,
  toggleOpen,
  width,
  height,
  children,
  overlayClickClose = false,
}: ModalProps) {
  return (
    <ReactModal
      className="modal-container"
      style={{ content: { width, height } }}
      isOpen={isOpen}
      onRequestClose={toggleOpen}
      shouldCloseOnOverlayClick={overlayClickClose}
    >
      {children}
    </ReactModal>
  );
}
