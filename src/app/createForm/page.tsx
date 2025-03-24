"use client";
import React, { useState } from "react";
import styles from "./CreateForm.module.css";
import UserAvatar from "../../components/userAvatar/UserAvatar";
import { createPortal } from "react-dom";

const inputFields = [
  { label: "Image", name: "image"},
  { label: "Name", name: "name" },
  { label: "Short Description", name: "shortDescription" },
  { label: "End Date", name: "endDate" },
  
];

interface CreateFormProps {
  onClose: () => void; // Function to close the modal
  onCreateOpportunity: (newOpportunity: { [key: string]: string }) => void; // Callback to handle the creation of a new opportunity
}

const CreateForm: React.FC<CreateFormProps> = ({ onClose, onCreateOpportunity }) => {
  const [formData, setFormData] = useState({
    name: "",
    organizer: "",
    shortDescription: "",
    endDate: "",
    image:"",
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
      const value = formData[field.name as keyof typeof formData];

      // Check if the value is empty
      if (!value) {
        newErrors[field.name] = `${field.label} is required.`;
        isValid = false;
      } else if (field.name !== "endDate" && !startWithLettersRegex.test(value)) {
        // Check if the value starts with at least two letters (except for endDate)
        newErrors[field.name] = `${field.label} must start with at least two letters.`;
        isValid = false;
      }
    });

    // Organizer validation
    if (!formData.organizer) {
      newErrors["organizer"] = "Organizer is required.";
      isValid = false;
    } else if (!startWithLettersRegex.test(formData.organizer)) {
      newErrors["organizer"] = "Organizer must start with at least two letters.";
      isValid = false;
    }

    // End Date validation (should be a valid date)
    if (formData.endDate && isNaN(new Date(formData.endDate).getTime())) {
      newErrors["endDate"] = "End Date must be a valid date.";
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
          <button className={styles.closeButton} onClick={onClose}>
            ✖
          </button>

          <div className={styles.header}>Create Opportunity</div>

          <form className={styles.formGrid} onSubmit={handleSubmit}>
            {/* Organizer Field */}
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

            {/* Other Fields */}
            {inputFields.map((field, index) => (
              <div key={index} className={styles.inputGroup}>
                <div className={styles.label}>{field.label}</div>
                <input
                  type={field.name === "endDate" ? "date" : "text"} // Use "date" input for endDate
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                {errors[field.name] && <div className={styles.errorText}>{errors[field.name]}</div>}
              </div>
            ))}

            {/* Create Button */}
            <button type="submit" className={styles.createButton}>
              Create Opportunity
            </button>
          </form>

          {/* Footer */}
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