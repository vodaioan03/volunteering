"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./ViewOpportunity.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import { useOpportunities, Opportunity } from "@/context/OpportunitiesContext";
import UpdateForm from "../updateForm/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTrash, faCalendar, faUsers, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
const ViewOpportunity = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { opportunities, deleteOpportunity, updateOpportunity } = useOpportunities();

  // Extract search parameters
  const title = searchParams.get("title") || "Default Title";

  // Find the opportunity in the context using the title
  const opportunity = opportunities.find((opp) => opp.title === title);

  // State for opportunity data
  const [opportunityData, setOpportunityData] = useState<Opportunity>({
    title: opportunity?.title || title,
    organizer: opportunity?.organizer || "Unknown Organizer",
    shortDescription: opportunity?.shortDescription || "Short description fail",
    description: opportunity?.description || "Description fails",
    image: opportunity?.image || "https://via.placeholder.com/150",
    views: opportunity?.views || "0",
    endDate: opportunity?.endDate || "",
  });

  // State for update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Handle delete
  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this opportunity?");
    if (confirmDelete) {
      deleteOpportunity(opportunityData.title); // Use the updated title
      router.push("/volunteers");
    }
  };

  // Handle update
  const handleUpdate = (updatedData: { [key: string]: string }) => {
    // Create the updated opportunity object
    const updatedOpportunity: Opportunity = {
      ...opportunityData, // Preserve existing fields
      title: updatedData.name || opportunityData.title,
      organizer: updatedData.organizer || opportunityData.organizer,
      shortDescription: updatedData.shortDescription || opportunityData.shortDescription,
      description: updatedData.description || opportunityData.description,
      endDate: updatedData.endDate || opportunityData.endDate,
      image: updatedData.image || opportunityData.image,
    };

    // Call the updateOpportunity function
    updateOpportunity(title, updatedOpportunity);

    // Update local state
    setOpportunityData(updatedOpportunity);

    // Close the modal
    setShowUpdateModal(false);
  };

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => router.push("/volunteers")}>
          <span className={styles.backArrow}>←</span> Back
        </button>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <Image
          src={opportunityData.image}
          alt="Opportunity Image"
          width={150}
          height={150}
          className={styles.headerImage}
        />
        <h1 className={styles.headerTitle}>{opportunityData.title}</h1>
        <p className={styles.headerDescription}>{opportunityData.shortDescription}</p>
        <div className={styles.headerButtons}>
          <button
            className={`${styles.headerButton} ${styles.headerButtonUpdate}`}
            onClick={() => setShowUpdateModal(true)}
          >
            Update
          </button>
          <button
            className={`${styles.headerButton} ${styles.headerButtonDelete}`}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Organizer Section */}
      <div className={styles.organizerSection}>
        <div className={styles.organizerContent}>

          <FontAwesomeIcon icon={faUser} className={styles.infoIcon} />
          <h2 className={styles.organizerTitle}>Organizer</h2>
          <p className={styles.organizerName}>{opportunityData.organizer}</p>
        </div>
      </div>

      {/* Description Section */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>Description</h2>
        <p className={styles.descriptionText}>{opportunityData.description}</p>
      </div>

      {/* Information Section */}
      <div className={styles.informationSection}>
        <h2 className={styles.informationTitle}>Information</h2>
        <div className={styles.informationGrid}>
          <div className={styles.informationItem}>
      
            <FontAwesomeIcon icon={faCalendar} className={styles.infoIcon} />
            <p className={styles.infoText}>End Date: {opportunityData.endDate}</p>
          </div>
          <div className={styles.informationItem}>
            <FontAwesomeIcon icon={faUsers} className={styles.infoIcon} />
            <p className={styles.infoText}>Views: {opportunityData.views}</p>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <UpdateForm
          onClose={() => setShowUpdateModal(false)}
          onUpdateOpportunity={handleUpdate}
          initialData={{
            image: opportunityData.image,
            name: opportunityData.title,
            organizer: opportunityData.organizer,
            shortDescription: opportunityData.shortDescription,
            endDate: opportunityData.endDate,
          }}
        />
      )}
    </div>
  );
};

export default ViewOpportunity;