"use client";
import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import styles from "./Volunteers.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar, faSort, faPlus, faWifi, faServer } from "@fortawesome/free-solid-svg-icons";
import CreateForm from "../createForm/page";
import { useRouter } from "next/navigation";
import Card from "@/components/cards/opportunitieCard/card";
import { opportunityService } from "@/services/opportunities";
import type { Opportunity, OpportunityCreate } from "@/types/opportunity";
import { useError } from "@/context/ErrorContext";
import { useAuth } from "@/context/AuthContext";

const OpportunitiesPage = () => {
  const router = useRouter();
  const { showError } = useError();
  const { isAuthenticated } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: true,
    isServerAvailable: true
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const PAGE_SIZE = 10;

  // Initial data loading
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const { data, total } = await opportunityService.getPaginated(1, PAGE_SIZE);
      setOpportunities(data);
      setHasMore(data.length < total);
      setCurrentPage(1);
      
      // Check network status
      const status = await opportunityService.checkNetworkStatus();
      setNetworkStatus(status);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('Failed to load opportunities');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load more opportunities when scrolling
  const loadMoreOpportunities = useCallback(async () => {
    if (isFetching || !hasMore) {
      return;
    }
    
    setIsFetching(true);
    try {
      const nextPage = currentPage + 1;
      const { data, total } = await opportunityService.getPaginated(nextPage, PAGE_SIZE);
      
      setOpportunities(prev => {
        const newItems = data.filter(newItem => 
          !prev.some(existingItem => existingItem.id === newItem.id)
        );
        return [...prev, ...newItems];
      });
      
      setHasMore((nextPage * PAGE_SIZE) < total);
      setCurrentPage(nextPage);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('Failed to load more opportunities');
      }
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, hasMore, currentPage, showError]);

  // Observer callback for infinite scroll
  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (isFetching || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
  
    if (node) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isFetching && hasMore) {
            loadMoreOpportunities();
          }
        },
        { root: null, rootMargin: "100px", threshold: 0.1 }
      );
      observer.current.observe(node);
    }
  }, [isFetching, hasMore, loadMoreOpportunities]);

  // Cleanup observer
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const sortedOpportunities = useMemo(() => {
    return [...opportunities].sort((a, b) => 
      sortOrder === "asc"
        ? new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        : new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    );
  }, [opportunities, sortOrder]);

  // Sort opportunities
  const sortOpportunities = async () => {
    try {
      setLoading(true);
      const allData = sortOrder === "asc" 
        ? await opportunityService.getAscending() 
        : await opportunityService.getDescending();
      
      if (Array.isArray(allData)) {
        const sortedData = [...allData].sort((a, b) => 
          sortOrder === "asc" 
            ? new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
            : new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        );
        
        setOpportunities(sortedData.slice(0, currentPage * PAGE_SIZE));
        setHasMore(sortedData.length > currentPage * PAGE_SIZE);
      }
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('Failed to sort opportunities');
      }
    } finally {
      setLoading(false);
    }
  };

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
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    sortOpportunities();
  };   

  

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

      const createdOpportunity = await opportunityService.createWithOfflineSupport(newOpportunity);
      await loadInitialData();
      setIsCreateFormOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('Failed to create opportunity');
      }
    }
  };

  // Get first/last ending opportunities
  const [firstEndingOpportunity, lastEndingOpportunity] = useMemo(() => {
    if (opportunities.length === 0) return [null, null];
    return sortOrder === "asc" 
      ? [opportunities[0], opportunities[opportunities.length - 1]]
      : [opportunities[opportunities.length - 1], opportunities[0]];
  }, [opportunities, sortOrder]);

  // Handle add button click with auth check
  const handleAddButtonClick = () => {
    if (!isAuthenticated) {
      showError("Please log in to create an opportunity");
      return;
    }
    setIsCreateFormOpen(true);
  };

  if (loading) return <div className={styles.loading}>Loading opportunities...</div>;

  return (
    <div className={styles.container}>
      {/* Offline status banner */}
      {(!networkStatus.isOnline || !networkStatus.isServerAvailable) && (
        <div className={`
          ${styles.offlineBanner}
          ${!networkStatus.isOnline ? styles.networkOffline : ''}
          ${networkStatus.isOnline && !networkStatus.isServerAvailable ? styles.serverOffline : ''}
        `}>
          {!networkStatus.isOnline ? (
            <>
              <FontAwesomeIcon icon={faWifi} />
              <span>You're offline. Changes will be synced when you reconnect.</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faServer} />
              <span>Server unavailable. Working in offline mode.</span>
            </>
          )}
          {opportunityService.getPendingOperationsCount() > 0 && (
            <span className={styles.pendingChanges}>
              {opportunityService.getPendingOperationsCount()} pending changes
            </span>
          )}
        </div>
      )}

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
              className={`${styles.addButton} ${!isAuthenticated ? styles.addButtonDisabled : ''}`}
              onClick={handleAddButtonClick}
            >
              <FontAwesomeIcon icon={faPlus} className={styles.addButtonIcon} />
              Add Opportunity
            </button>
          </div>
        </div>
        
        <div className={styles.listLayoutCards}>
          {opportunities.map((opp, index) => {
            const isFirstEnding = opp.id === firstEndingOpportunity?.id;
            const isLastEnding = opp.id === lastEndingOpportunity?.id;
            const isLastItem = index === opportunities.length - 1;

            return (
              <div 
                key={`${opp.id}-${index}`}
                ref={isLastItem ? lastItemRef : null}
                onClick={() => router.push(`/viewOpportunity?id=${opp.id}`)}
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
          
          {/* Loading indicators */}
          {isFetching && (
            <div className={styles.loadingMore}>
              <div className={styles.spinner}></div>
              Loading more opportunities...
            </div>
          )}

          {!hasMore && !loading && (
            <div className={styles.endOfResults}>
              You've reached the end of the list
            </div>
          )}
        </div>
      </div>

      {/* Create Form Modal */}
      {isCreateFormOpen && (
        <CreateForm
          onClose={() => setIsCreateFormOpen(false)}
          onCreateOpportunity={handleCreateOpportunity}
          isOnline={networkStatus.isOnline && networkStatus.isServerAvailable}
        />
      )}
    </div>
  );
};

export default OpportunitiesPage;