"use client";

import React, { useState } from "react";
import SuccessModal from "@/components/ui/SuccessModal";
import { FormButton } from "./ButtonComponents";

const FormActions = ({ primaryClassName = "bg-customBlue hover:bg-customBlue/90", onSave, tabName = "Item", onSuccessClose }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (onSave) {
      const result = onSave();
      // Only show success modal if onSave returns true or doesn't return false
      if (result === false) {
        return; // Don't show success if validation failed
      }
    }
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    if (onSuccessClose) onSuccessClose();
  };

  return (
    <>
      <div className="flex gap-3 md:pt-4 mt-4 md:mt-6 justify-end">
        <FormButton theme="cancel" text="Cancel" />
        <FormButton theme="primary" text="Save" onClick={handleSave} className={primaryClassName} />
      </div>

      <SuccessModal
        isOpen={showSuccess}
        title="Created Successfully"
        message={`New ${tabName} has been created successfully.`}
        type="create"
        onClose={handleCloseSuccess}
      />
    </>
  );
};

export default FormActions;
