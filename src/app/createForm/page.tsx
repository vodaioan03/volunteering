"use client";
import React, { useState } from "react";
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

interface CreateFormProps {
  onClose: () => void; // Type for the function prop
  onCreateOpportunity: (newOpportunity: { [key: string]: string }) => void; // Callback to handle the creation of a new opportunity
}

const CreateForm: React.FC<CreateFormProps> = ({ onClose, onCreateOpportunity }) => {
  const [formData, setFormData] = useState({
    opportunityName: "",
    organizationName: "",
    shortDescription: "",
    description: "",
    days: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;


    const startWithLettersRegex = /^[A-Za-z]{2,}/;
    // Required fields validation
    inputFields.forEach((field) => {
      const value = formData[field.name];
      
      // Check if the value is empty
      if (!value) {
        newErrors[field.name] = `${field.label} is required.`;
        isValid = false;
      } else if (!startWithLettersRegex.test(value) && !formData.days) {
        // Check if the value starts with at least two letters
        newErrors[field.name] = `${field.label} must start with at least two letters.`;
        isValid = false;
      }
    });
    // Days validation (should be a number)
    if (formData.days && isNaN(Number(formData.days))) {
      newErrors["days"] = "Days must be a valid number.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCreateOpportunity(formData); // Pass the form data to the parent component
      onClose(); // Close the modal after submitting the data
    }
  };

  return createPortal(
    <div className={styles.container}>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>✖</button>

          <div className={styles.header}>Create Opportunity</div>

          <div className={styles.profileSection}>
            <UserAvatar />
            <div className={styles.organizationInputWrapper}>
              <input
                type="text"
                placeholder="Organization Name"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleInputChange}
                className={styles.organizationInput}
              />
            </div>
          </div>

          <form className={styles.formGrid} onSubmit={handleSubmit}>
            {inputFields.map((field, index) => (
              <div key={index} className={styles.inputGroup}>
                <div className={styles.label}>{field.label}</div>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                {errors[field.name] && <div className={styles.errorText}>{errors[field.name]}</div>}
              </div>
            ))}
            <button type="submit" className={styles.createButton}>Create Opportunity</button>
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
