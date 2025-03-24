import React from "react";
import styles from "./InformationSection.module.css";

const InformationSection = () => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <div className={styles.sectionTitle}>Informations</div>
    </div>
    <div className={styles.infoSection}>
      <div className={styles.infoText}>
        Posted date:
        <br />
      </div>
      <div className={styles.infoItem}>Starting date - Finish date:</div>
      <div className={styles.infoItem}>Number of Members:</div>
      <div className={styles.infoItem}>Location:</div>
      <div className={styles.infoItem}>Fee payment:</div>
      <div className={styles.infoItem}>Age Region:</div>
    </div>
  </div>
);

export default InformationSection;