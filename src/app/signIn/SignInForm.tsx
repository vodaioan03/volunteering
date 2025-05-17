"use client";
import React from "react";
import styles from "./SignIn.module.css";
import { createPortal } from "react-dom";
import Link from "next/link";

const inputFields = [
  { label: "Email", value: "Type Here" },
  { label: "Password", value: "Type Here" }
];

interface SignInFormProps {
  onClose: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onClose }) => {
  // Function to handle the close and navigation
  const handleLinkClick = () => {
    onClose();  // Close the modal
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>

        <div className={styles.header}>Login Page</div>

        <div className={styles.formGrid}>
          {inputFields.map((field, index) => (
            <div key={index} className={styles.inputGroup}>
              <div className={styles.label}>{field.label}</div>
              <input type="text" className={styles.input} />
            </div>
          ))}
        </div>
        
        {/* Updated link */}
        <Link
          href="/viewProfile"
          className={styles.createButton}
          onClick={handleLinkClick} // Close the modal before navigating
        >
          Login
        </Link>
      </div>
    </div>,
    document.body
  );
};

export default SignInForm; 