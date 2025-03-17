import React from "react";
import styles from "./ProfileInfo.module.css";
import { ArrowRight } from "lucide-react";

interface InfoSectionProps {
  title: string;
  items: string[];
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, items }) => (
  <div className={styles.infoSection}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    <div className={styles.itemsList}>
      {items.map((item, index) => (
        <div key={index} className={styles.infoItem}>
          <span className={styles.bullet}>•</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const ProfileInfo = () => {
  const personalInfo = [
    "Full name:",
    "Location",
    "Birthday Date:",
    "Gender:",
    "Phone Number:",
  ];

  const profileInfo = [
    "Username:",
    "Email:",
    "Role:",
    "Last Donation:",
    "Number of organizations:",
  ];

  const skills = [
    "Technical:",
    "Soft:",
    "Creative:",
    "Hospitality:",
    "Languages:",
  ];

  const preferences = [
    "Notifications:",
    "Emergency Contact:",
    "Avalability(h/day):",
    "Volunteer Driver:",
    "Night Shift:",
  ];

  return (
    <div className={styles.mainContent}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile Informations</h1>
        <button className={styles.iconButton}>
          <ArrowRight size={24} />
        </button>
      </div>

      <p className={styles.description}>
        Lena's journey into photography began as a teenager when her father
        gifted her a secondhand DSLR camera. What started as a hobby soon turned
        into a lifelong passion as she discovered the power of visual
        storytelling. She realized that through her lens, she could not only
        capture the beauty of the natural world but also raise awareness about
        the urgent need for conservation. After completing her degree in
        Environmental Science at the University of Costa Rica, Lena decided to
        merge her academic knowledge with her artistic skills, dedicating her
        life to documenting endangered species and thr...
      </p>

      <div className={styles.infoGrid}>
        <InfoSection title="Person Informations:" items={personalInfo} />
        <InfoSection title="Profile Informations" items={profileInfo} />
        <InfoSection title="Skills" items={skills} />
        <InfoSection title="Preference Settings:" items={preferences} />
      </div>
    </div>
  );
};

export default ProfileInfo;
