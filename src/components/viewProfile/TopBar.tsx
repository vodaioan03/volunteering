import React from "react";
import Image from "next/image";
import styles from "./Topbar.module.css";

// Define the props interface
interface TopBarProps {
  title: string; // The title to display
  onBack: () => void; // Callback function for the back button
}

const TopBar: React.FC<TopBarProps> = ({ title, onBack }) => (
  <div className={styles.topBar}>
    <div className={styles.leadingIcon} onClick={onBack}>
      <div className={styles.iconContainer}>
        <div className={styles.stateLayer}>
          <Image
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c76676ff7d6690a155f3e947df80d6723a547e344e83ee13acb153937a49b6e?placeholderIfAbsent=true"
            alt="Back"
            width={24}
            height={24}
            className={styles.iconImage}
          />
        </div>
      </div>
    </div>
    <div className={styles.headline}>{title}</div>
    <Image
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/2929f59dbf6efd59351a8cda622cc9ca1b61f439c0591fe95abe22ef7ddf7310?placeholderIfAbsent=true"
      alt="Logo"
      width={96}
      height={48}
      className={styles.logoImage}
    />
  </div>
);

export default TopBar;