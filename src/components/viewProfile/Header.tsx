import React from "react";
import Image from "next/image";
import styles from "./Header.module.css";

// Define the props interface
interface HeaderProps {
  image: string; // URL of the image
  title: string; // Title of the opportunity
  shortDescription: string; // Short description of the opportunity
  onUpdate: () => void; // Callback for the Update button
  onDelete: () => void; // Callback for the Delete button
}

const Header: React.FC<HeaderProps> = ({ image, title, shortDescription, onUpdate, onDelete }) => (
  <div className={styles.header}>
    <Image src={image} alt="Opportunity" width={216} height={216} className={styles.headerImage} />
    <div className={styles.contentWrapper}>
      <div className={styles.headlineContent}>
        <div className={styles.opportunityTitle}>{title}</div>
        <div className={styles.publishedDate}>Published date</div>
        <div className={styles.supportingText}>{shortDescription}</div>
      </div>
      <div className={styles.buttonGroup}>
        <button className={`${styles.button} ${styles.buttonUpdate}`} onClick={onUpdate}>
          Update
        </button>
        <button className={`${styles.button} ${styles.buttonDelete}`} onClick={onDelete}>
          Delete
        </button>
        <button className={`${styles.button} ${styles.buttonApply}`}>APPLY</button>
      </div>
    </div>
  </div>
);

export default Header;