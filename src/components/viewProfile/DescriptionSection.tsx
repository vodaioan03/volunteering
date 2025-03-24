import React from "react";
import styles from "./DescriptionSection.module.css";

// Define the props interface
interface DescriptionSectionProps {
  description: string; // The description text to display
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ description }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <div className={styles.sectionTitle}>Description</div>
    </div>
    <div className={styles.organizerCard}>
      <div className={styles.organizerContent}>
        <div className={styles.organizerInfo}>
          <div className={styles.organizerName}>{description}</div>
        </div>
      </div>
    </div>
  </div>
);

export default DescriptionSection;