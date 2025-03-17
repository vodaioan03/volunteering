"use client";
import React from "react";
import styles from "./Register.module.css";
import UserAvatar from "../../components/userAvatar/UserAvatar";
import { createPortal } from "react-dom";
import Link from "next/link";
const inputFields = [
  { label: "Username", value: "Type Here" },
  { label: "Full Name", value: "Type Here" },
  { label: "Email", value: "Type Here" },
  { label: "Confirm Email", value: "Type Here" },
  { label: "Password", value: "Type Here" },
  { label: "Confirm Password", value: "Type Here" },
  { label: "Phone Number", value: "Type Here" },
  { label: "City", value: "Type Here" },
  { label: "Birth Date", value: "Type Here" },
  { label: "Gender", value: "Type Here" }
];

interface RegisterPage {
  onClose: () => void; // Type for the function prop
}

const RegisterPage: React.FC<RegisterPage> = ({ onClose }) => {
  const handleLinkClick = () => {
    onClose();  // Close the modal
  };
  return createPortal(
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        
      <div className={styles.header}>Create Account</div>

      <div className={styles.profileSection}>
        <UserAvatar />
      </div>

      <div className={styles.formGrid}>
        {inputFields.map((field, index) => (
          <div key={index} className={styles.inputGroup}>
            <div className={styles.label}>{field.label}</div>
            <input type="text"  className={styles.input} />
          </div>
        ))}
      </div>
      {/* Updated link */}
      <Link
          href="/viewProfile"
          className={styles.createButton}
          onClick={handleLinkClick} // Close the modal before navigating
        >
          Create Account
        </Link>
       </div>
    </div>,
    document.body
  );
}

export default RegisterPage;