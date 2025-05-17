"use client";
import React, { useState } from "react";
import styles from "./UpdateForm.module.css";
import { createPortal } from "react-dom";

const inputFields = [
  { label: "Name", name: "name" },
  { label: "Image", name: "image" }, // Image field for URL input
  { label: "Short Description", name: "shortDescription" },
  { label: "End Date", name: "endDate" },
];

interface UpdateFormProps {
  onClose: () => void; // Function to close the modal
  onUpdateOpportunity: (updatedOpportunity: { [key: string]: string }) => void | Promise<void>; // Callback to handle the update of an opportunity
  initialData: {
    name: string;
    organizer: string;
    shortDescription: string;
    endDate: string;
    image: string; // Optional image URL
  }; // Initial data for the form
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  onClose,
  onUpdateOpportunity,
  initialData,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the specific field
    }));
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

    // End Date validation (should be a valid date)
    if (formData.endDate && isNaN(new Date(formData.endDate).getTime())) {
      newErrors["endDate"] = "End Date must be a valid date.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onClose(); // Close immediately after validation
      try {
        await onUpdateOpportunity({
          ...formData,
        });
      } catch (error) {
        console.error('Failed to update opportunity:', error);
      }
    }
  };

  return createPortal(
    <div className={styles.container}>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>✖</button>

          <div className={styles.header}>Update Opportunity</div>

          {/* Image Display */}
          <div className={styles.imageContainer}>
            <img
              key={formData.image}
              src={formData.image || "https://via.placeholder.com/120"}
              alt="Opportunity"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/120";
              }}
            />
          </div>

          {/* Organizer Field */}
          <div className={styles.organizationInputWrapper}>
            <input
              type="text"
              placeholder="Organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleInputChange}
              className={styles.organizationInput}
            />
            {errors.organizer && <div className={styles.errorText}>{errors.organizer}</div>}
          </div>

          {/* Form Fields */}
          <form className={styles.formGrid} onSubmit={handleSubmit}>
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

            {/* Update Button - Moved inside form */}
            <button type="submit" className={styles.createButton}>
              Update Opportunity
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

export default UpdateForm; 