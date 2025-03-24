import React from "react";
import Image from "next/image";
import styles from "./OrganizerSection.module.css";

// Define the props interface
interface OrganizerSectionProps {
  organizer: string; // The name of the organizer
}

const OrganizerSection: React.FC<OrganizerSectionProps> = ({ organizer }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <div className={styles.sectionTitle}>Organizer</div>
      <div className={styles.leadingIcon}>
        <div className={styles.iconContainer}>
          <div className={styles.stateLayer}>
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d85cc389d575d1c745432ced908ae74c42a36354e058c8c03f0993604723707f?placeholderIfAbsent=true"
              alt="More"
              width={24}
              height={24}
              className={styles.iconImage}
            />
          </div>
        </div>
      </div>
    </div>
    <div className={styles.organizerCard}>
      <div className={styles.organizerContent}>
        <Image
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/edf2578a1f1de7bd15c651bfa54047659a7e892107e0375b07822e89c5b0b2be?placeholderIfAbsent=true"
          alt="Organizer"
          width={120}
          height={120}
          className={styles.organizerImage}
        />
        <div className={styles.organizerInfo}>
          <div className={styles.organizerName}>{organizer}</div>
          <div className={styles.organizerDescription}>Organizer short description</div>
        </div>
      </div>
    </div>
  </div>
);

export default OrganizerSection;