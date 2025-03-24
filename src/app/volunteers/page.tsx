"use client";
import React, { useState, useMemo } from "react";
import styles from "./Volunteers.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar, faSort, faPlus, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import CreateForm from "../createForm/page";
import { useRouter } from "next/navigation";
import { useOpportunities, Opportunity } from "@/context/OpportunitiesContext";
import Card, { CardProps } from "@/components/cards/opportunitieCard/card";

const OpportunitiesPage = () => {
  const router = useRouter();
  const { opportunities, addOpportunity, deleteOpportunity, updateOpportunity } = useOpportunities();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const opportunitiesPerPage = 10;

  // Navigation functions
  const navigateToOpportunities = () => console.log("Navigating to Opportunities");
  const navigateToErasmus = () => console.log("Navigating to Erasmus");
  const navigateToDonations = () => console.log("Navigating to Donations");
  const navigateToOrganizations = () => console.log("Navigating to Organizations");
  const navigateToVolunteers = () => console.log("Navigating to Volunteers");

  const sideBarButtons = [
    { name: "Opportunities", route: navigateToOpportunities },
    { name: "Erasmus", route: navigateToErasmus },
    { name: "Donations", route: navigateToDonations },
    { name: "Organizations", route: navigateToOrganizations },
    { name: "Volunteers", route: navigateToVolunteers },
  ];

  // Toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // Sort opportunities by endDate
  const sortedOpportunities = useMemo(() => {
    return [...opportunities].sort((a, b) => {
      const dateA = new Date(a.endDate).getTime();
      const dateB = new Date(b.endDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [opportunities, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedOpportunities.length / opportunitiesPerPage);
  const startIndex = (currentPage - 1) * opportunitiesPerPage;
  const endIndex = startIndex + opportunitiesPerPage;
  const currentOpportunities = sortedOpportunities.slice(startIndex, endIndex);

  // Handle opportunity creation
  const handleCreateOpportunity = (newOpportunity: { [key: string]: string }) => {
    const newCard: Opportunity = {
      title: newOpportunity.name,
      organizer: newOpportunity.organizer,
      shortDescription: newOpportunity.shortDescription || "",
      description: newOpportunity.description || "",
      image: newOpportunity.image || "https://cdn.pixabay.com/photo/2021/01/04/10/41/icon-5887126_1280.png",
      views: "0",
      endDate: newOpportunity.endDate,
    };
    addOpportunity(newCard);
    setIsCreateFormOpen(false);
  };

  // Handle opportunity click
  const handleOpportunityClick = (opp: Opportunity) => {
    router.push(
      `/viewOpportunity?title=${encodeURIComponent(opp.title)}&organizer=${encodeURIComponent(
        opp.organizer
      )}&shortdesc=${encodeURIComponent(opp.shortDescription)}&description=${encodeURIComponent(
        opp.description
      )}&image=${encodeURIComponent(opp.image)}`
    );
  };


  // Get the first and last ending opportunities based on the current sorting order
  const firstEndingOpportunity = useMemo(() => {
    return sortOrder === "asc" ? sortedOpportunities[0] : sortedOpportunities[sortedOpportunities.length - 1];
  }, [sortedOpportunities, sortOrder]);

  const lastEndingOpportunity = useMemo(() => {
    return sortOrder === "asc" ? sortedOpportunities[sortedOpportunities.length - 1] : sortedOpportunities[0];
  }, [sortedOpportunities, sortOrder]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sideBar}>
  <div className={styles.sideBarList}>
    {sideBarButtons.map((actualButton) => (
      <div
        key={actualButton.name}
        className={`${styles.sideBarbutton} ${
          actualButton.name === "Opportunities" ? styles.active : "" // Example for active button
        }`}
        onClick={actualButton.route}
      >
        <FontAwesomeIcon icon={faStar} className={styles.icon} />
        <p>{actualButton.name}</p>
      </div>
    ))}
  </div>
</div>
      <div className={styles.listLayout}>
        <div className={styles.listLayoutTitle}>Opportunities List</div>
        <div className={styles.listLayoutSearch}>
          <div className={styles.sortContainer}>
            <button className={styles.sortButton} onClick={toggleSortOrder}>
              <FontAwesomeIcon icon={faSort} className={styles.sortButtonIcon} />
              Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
            </button>
          </div>
          <input
            className={styles.listLayoutSearchInput}
            type="text"
            placeholder="Search..."
          />
          <button className={styles.searchButton}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchButtonIcon} />
            Search
          </button>
          <div className={styles.addButtonContainer}>
            <button className={styles.addButton} onClick={() => setIsCreateFormOpen(true)}>
              <FontAwesomeIcon icon={faPlus} className={styles.addButtonIcon} />
              Add Opportunity
            </button>
          </div>
        </div>
        <div className={styles.listLayoutCards}>
        {currentOpportunities.map((opp, index) => {
          const isFirstEnding = opp.title === firstEndingOpportunity?.title;
          const isLastEnding = opp.title === lastEndingOpportunity?.title;

          // Apply conditional styling
          const cardStyle = {
            border: isFirstEnding
              ? "2px solid green" // Highlight first ending in green
              : isLastEnding
              ? "2px solid red" // Highlight last ending in red
              : "1px solid #ccc", // Default border
          };

          return (
            <div key={index} onClick={() => handleOpportunityClick(opp)} style={cardStyle}>
              <Card
                image={opp.image}
                name={opp.title}
                organizer={opp.organizer}
                views={opp.views}
                endDate={opp.endDate}
              />
            </div>
          );
        })}
        </div>
        <div className={styles.paginationContainer}>
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <span className={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
      {isCreateFormOpen && (
        <CreateForm
          onClose={() => setIsCreateFormOpen(false)}
          onCreateOpportunity={handleCreateOpportunity}
        />
      )}
    </div>
  );
};

export default OpportunitiesPage;