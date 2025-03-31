"use client";
import React, { useState, useMemo, useEffect } from "react";
import styles from "./Volunteers.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar, faSort, faPlus, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import CreateForm from "../createForm/page";
import { useRouter } from "next/navigation";
import Card from "@/components/cards/opportunitieCard/card";
import { opportunityService } from "@/services/opportunities";
import type { Opportunity, OpportunityCreate } from "@/types/opportunity";

const OpportunitiesPage = () => {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [sortedOpportunities, setSortedOpportunities] = useState<Opportunity[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const opportunitiesPerPage = 10;

  // Fetch opportunities on component mount
  const loadOpportunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await opportunityService.getAll();
      setOpportunities(data);
      setSortedOpportunities(data); // Initialize sortedOpportunities
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  // Sort opportunities by endDate
  const sortOpportunities = async () => {
    try {
      setLoading(true);
      const data = sortOrder === "asc" 
        ? await opportunityService.getAscending() 
        : await opportunityService.getDescending();
      setSortedOpportunities(data);
      setCurrentPage(1); // Reset to first page when sorting changes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sort opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sortOpportunities();
  }, [sortOrder]);

  // Navigation functions
  const navigateTo = (route: string) => {
    router.push(`/${route.toLowerCase()}`);
  };

  const sideBarButtons = [
    { name: "Opportunities", route: "opportunities" },
    { name: "Erasmus", route: "erasmus" },
    { name: "Donations", route: "donations" },
    { name: "Organizations", route: "organizations" },
    { name: "Volunteers", route: "volunteers" },
  ];

  // Toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  // Pagination logic
  const totalPages = Math.ceil(sortedOpportunities.length / opportunitiesPerPage);
  const startIndex = (currentPage - 1) * opportunitiesPerPage;
  const endIndex = startIndex + opportunitiesPerPage;
  const currentOpportunities = sortedOpportunities.slice(startIndex, endIndex);

  // Handle opportunity creation
  const handleCreateOpportunity = async (formData: Record<string, string>) => {
    try {
      const newOpportunity: OpportunityCreate = {
        title: formData.name,
        organizer: formData.organizer,
        shortDescription: formData.shortDescription || "",
        description: formData.description || "",
        image: formData.image || "https://cdn.pixabay.com/photo/2021/01/04/10/41/icon-5887126_1280.png",
        endDate: formData.endDate,
      };

      const createdOpportunity = await opportunityService.create(newOpportunity);
      
      setOpportunities(prev => [...prev, {
        ...createdOpportunity,
        views: createdOpportunity.views || "0"
      }]);
      
      // Re-sort after adding new opportunity
      await sortOpportunities();
      setIsCreateFormOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create opportunity';
      setError(message);
      console.error('Creation error:', err);
    }
  };

  // Handle opportunity click
  const handleOpportunityClick = (opp: Opportunity) => {
    router.push(`/viewOpportunity?id=${opp.id}`);
  };

  // Get first/last ending opportunities
  const [firstEndingOpportunity, lastEndingOpportunity] = useMemo(() => {
    if (sortedOpportunities.length === 0) return [null, null];
    return sortOrder === "asc" 
      ? [sortedOpportunities[0], sortedOpportunities[sortedOpportunities.length - 1]]
      : [sortedOpportunities[sortedOpportunities.length - 1], sortedOpportunities[0]];
  }, [sortedOpportunities, sortOrder]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  if (loading) return (
    <div className={styles.loading}>
      Loading opportunities...
    </div>
  );
  
  if (error) return (
    <div className={styles.error}>
      <div className={styles.errorIcon}>⚠️</div>
      Error: {error}
      <button 
        className={styles.retryButton} 
        onClick={loadOpportunities}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      {/* Sidebar */}
      <div className={styles.sideBar}>
        <div className={styles.sideBarList}>
          {sideBarButtons.map((button) => (
            <div
              key={button.name}
              className={`${styles.sideBarbutton} ${
                button.name === "Opportunities" ? styles.active : ""
              }`}
              onClick={() => navigateTo(button.route)}
            >
              <FontAwesomeIcon icon={faStar} className={styles.icon} />
              <p>{button.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
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
            <button 
              className={styles.addButton} 
              onClick={() => setIsCreateFormOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} className={styles.addButtonIcon} />
              Add Opportunity
            </button>
          </div>
        </div>
        
        {/* Opportunity Cards */}
        <div className={styles.listLayoutCards}>
          {currentOpportunities.map((opp, index) => {
            const isFirstEnding = opp.id === firstEndingOpportunity?.id;
            const isLastEnding = opp.id === lastEndingOpportunity?.id;

            return (
              <div 
                key={`${opp.id}-${index}`}
                onClick={() => handleOpportunityClick(opp)}
                style={{
                  border: isFirstEnding ? "2px solid green" :
                         isLastEnding ? "2px solid red" :
                         "1px solid #ccc",
                  cursor: "pointer"
                }}
              >
                <Card
                  id={opp.id}
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
        
        {/* Pagination */}
        {totalPages > 1 && (
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
        )}
      </div>
      
      {/* Create Form Modal */}
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