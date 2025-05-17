"use client";
import React, { useState } from "react";
import styles from "./CreateForm.module.css";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const inputFields = [
  { label: "Image URL", name: "image" },
  { label: "Title", name: "title" },
  { label: "Short Description", name: "shortDescription" },
  { label: "End Date", name: "endDate" },
];

interface CreateFormProps {
  onClose: () => void;
  onCreateOpportunity: (newOpportunity: { [key: string]: string }) => void;
  isOnline: boolean;
}

const CreateForm: React.FC<CreateFormProps> = ({ 
  onClose, 
  onCreateOpportunity,
  isOnline 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    organizer: "",
    shortDescription: "",
    endDate: "",
    image: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    const startWithLettersRegex = /^[A-Za-z]{2,}/;

    inputFields.forEach((field) => {
      const value = formData[field.name as keyof typeof formData];

      if (!value) {
        newErrors[field.name] = `${field.label} is required.`;
        isValid = false;
      } else if (field.name !== "endDate" && !startWithLettersRegex.test(value)) {
        newErrors[field.name] = `${field.label} must start with at least two letters.`;
        isValid = false;
      }
    });

    if (!formData.organizer) {
      newErrors["organizer"] = "Organizer is required.";
      isValid = false;
    } else if (!startWithLettersRegex.test(formData.organizer)) {
      newErrors["organizer"] = "Organizer must start with at least two letters.";
      isValid = false;
    }

    if (formData.endDate && isNaN(new Date(formData.endDate).getTime())) {
      newErrors["endDate"] = "End Date must be a valid date.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Minimum loading time
      onCreateOpportunity(formData);
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : "Failed to create opportunity"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className={styles.container}>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>
            ✖
          </button>

          <div className={styles.header}>
            Create Opportunity
            {!isOnline && (
              <div className={styles.offlineBadge}>
                <FontAwesomeIcon icon={faCircleExclamation} />
                <span>Working offline</span>
              </div>
            )}
          </div>

          {submitError && (
            <div className={styles.submitError}>
              <FontAwesomeIcon icon={faCircleExclamation} />
              {submitError}
            </div>
          )}

          <form className={styles.formGrid} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <div className={styles.label}>Organizer</div>
              <input
                type="text"
                placeholder="Organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                className={styles.input}
              />
              {errors.organizer && <div className={styles.errorText}>{errors.organizer}</div>}
            </div>

            {inputFields.map((field, index) => (
              <div key={index} className={styles.inputGroup}>
                <div className={styles.label}>{field.label}</div>
                <input
                  type={field.name === "endDate" ? "date" : "text"}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                {errors[field.name] && <div className={styles.errorText}>{errors[field.name]}</div>}
              </div>
            ))}

            <button 
              type="submit" 
              className={styles.createButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Opportunity"}
            </button>
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

export default CreateForm; 