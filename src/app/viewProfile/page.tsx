"use client";
import React from "react";
import styles from "./ViewProfile.module.css";
import ProfileSidebar from "@/components/profileSidebar/ProfileSidebar";
import ProfileInfo from "@/components/profileInfo/ProfileInfo";

const ViewProfile = () => {
  return (
    <div className={styles.container}>
      <ProfileSidebar />
      <ProfileInfo />
    </div>
  );
};

export default ViewProfile;
