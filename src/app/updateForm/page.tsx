"use client";
import React, { useState,useEffect } from "react";
import styles from "./CreateForm.module.css";
import UserAvatar from "../../components/userAvatar/UserAvatar";
import { createPortal } from "react-dom";

const inputFields = [
  { label: "Opportunity Name", name: "opportunityName" },
  { label: "Organization Name", name: "organizationName" },
  { label: "Short Description", name: "shortDescription" },
  { label: "Description", name: "description" },
  { label: "Days", name: "days" },
];

interface UpdateFormProps {
  onClose: () => void;
  onUpdateOpportunity: (newOpportunity: { [key: string]: string }) => void;
  updatedTitle: string;
  updatedOrganizer: string;
  updatedShortDesc: string;
  updatedDesc: string;
  setUpdatedTitle: (value: string) => void;
  setUpdatedOrganizer: (value: string) => void;
  setUpdatedShortDesc: (value: string) => void;
  setUpdatedDesc: (value: string) => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  onClose,
  onUpdateOpportunity,
  updatedTitle,
  updatedOrganizer,
  updatedShortDesc,
  updatedDesc,
  setUpdatedTitle,
  setUpdatedOrganizer,
  setUpdatedShortDesc,
  setUpdatedDesc,
}) => {
  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const { value } = e.target;
    setter(value);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdateOpportunity({
      opportunityName: updatedTitle,
      organizationName: updatedOrganizer,
      shortDescription: updatedShortDesc,
      description: updatedDesc,
      days: "", // Assuming 'days' can be updated as well, but not provided here
    });
    onClose();
  };

  return createPortal(
    <div className={styles.container}>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>✖</button>

          <div className={styles.header}>Update Opportunity</div>

          <div className={styles.profileSection}>
            <UserAvatar />
            <div className={styles.organizationInputWrapper}>
              <input
                type="text"
                placeholder="Organization Name"
                value={updatedOrganizer}
                onChange={(e) => handleInputChange(e, setUpdatedOrganizer)}
                className={styles.organizationInput}
              />
            </div>
          </div>

          <form className={styles.formGrid} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <div className={styles.label}>Opportunity Name</div>
              <input
                type="text"
                value={updatedTitle}
                onChange={(e) => handleInputChange(e, setUpdatedTitle)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.label}>Short Description</div>
              <input
                type="text"
                value={updatedShortDesc}
                onChange={(e) => handleInputChange(e, setUpdatedShortDesc)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.label}>Description</div>
              <input
                type="text"
                value={updatedDesc}
                onChange={(e) => handleInputChange(e, setUpdatedDesc)}
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.createButton}>Update Opportunity</button>
          </form>

          <div className={styles.footer}>
            <div className={styles.footerText}>Volunteering</div>
            <div className={styles.footerDot}>•</div>
            <div className={styles.footerText}>Donations</div>
            <div className={styles.footerDot}>•</div>
            <div className={styles.footerText}>Erasmus projects</div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UpdateForm;