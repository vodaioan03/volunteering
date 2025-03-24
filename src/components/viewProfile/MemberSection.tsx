import React from "react";
import Image from "next/image";
import styles from "./MembersSection.module.css";

const MembersSection = () => {
  const volunteers = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Volunteer ${i + 1}`,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/9d8e64396669c6ea401e6c2cd0d94845d95c27cc6f67f5d539746b3e7fe6c248?placeholderIfAbsent=true",
    avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/20b7661fb92611d238b93ab28d142bfd2051614c07bcc4980f08cb5e6585bb85?placeholderIfAbsent=true",
  }));

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Members In Project</div>
      </div>
      <div className={styles.membersCarousel}>
        <div className={styles.carouselContent}>
          {volunteers.map((volunteer) => (
            <div key={volunteer.id} className={styles.memberItem}>
              <div className={styles.memberImageContainer}>
                <Image
                  src={volunteer.image}
                  alt={`Background ${volunteer.name}`}
                  width={96}
                  height={96}
                  className={styles.memberImageBackground}
                />
                <Image
                  src={volunteer.avatar}
                  alt={volunteer.name}
                  width={96}
                  height={96}
                  className={styles.memberImage}
                />
              </div>
              <div className={styles.memberName}>{volunteer.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembersSection;