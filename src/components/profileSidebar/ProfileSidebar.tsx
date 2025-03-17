import React from "react";
import styles from "./ProfileSidebar.module.css";
import UserAvatar from "../userAvatar/UserAvatar";

const menuItems = [
  "Organizations",
  "Volunteer History",
  "Opportunities",
  "Donations History",
  "Achievments & Badge",
  "Settings",
];

const ProfileSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.profileSection}>
        <UserAvatar size={96} />
        <div className={styles.userName}>Voda Ioan</div>
      </div>

      <div className={styles.infoLabel}>Informations</div>

      <nav className={styles.menuList}>
        {menuItems.map((item, index) => (
          <button key={index} className={styles.menuItem}>
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileSidebar;
