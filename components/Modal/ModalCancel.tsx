import React, { ReactNode } from "react";
import Modal from ".";

const ModalCancel = ({
  open,
  setOpen,
  children,
  title,
}: {
  open: boolean;
  setOpen: any;
  children: ReactNode;
  title?: string;
}) => {
  return (
    <Modal title={title} open={open} setOpen={setOpen}>
      <div className="w-[400px]">{children}</div>
    </Modal>
  );
};

export default ModalCancel;
