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


const OpportunitiesPage = () => {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: true,
    isServerAvailable: true
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const PAGE_SIZE = 10
  // Check network status periodically
  useEffect(() => {
    const checkStatus = async () => {
      const newStatus = await opportunityService.checkNetworkStatus();
      
      if (newStatus.isOnline !== networkStatus.isOnline || 
          newStatus.isServerAvailable !== networkStatus.isServerAvailable) {
        setNetworkStatus(newStatus);
        
        if ((newStatus.isOnline && newStatus.isServerAvailable) && 
            (!networkStatus.isOnline || !networkStatus.isServerAvailable)) {
          await opportunityService.syncOfflineOperations();
          loadInitialData(); // Refresh data after coming back online
        }
      }
    };
  
    const interval = setInterval(checkStatus, 5000);
    checkStatus(); // Initial check
    
    return () => clearInterval(interval);
  }, [networkStatus]);

  // Load initial data (featured + first page)
  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, total } = await opportunityService.getPaginated(1, PAGE_SIZE);
      
      if (Array.isArray(data)) {
        setOpportunities(data);
        setHasMore(total > data.length);
        setCurrentPage(1);
      } else {
        throw new Error('Received invalid data format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load opportunities';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load more opportunities when scrolling
  const loadMoreOpportunities = useCallback(async () => {
    console.log('Attempting to load more...');
    console.log('Current state:', { isFetching, hasMore, currentPage });
    
    if (isFetching || !hasMore) {
      console.log('Aborting - already fetching or no more items');
      return;
    }
    
    setIsFetching(true);
    try {
      const nextPage = currentPage + 1;
      const { data, total } = await opportunityService.getPaginated(nextPage, PAGE_SIZE);
      
      setOpportunities(prev => {
        // Filter out duplicates just in case
        const newItems = data.filter(newItem => 
          !prev.some(existingItem => existingItem.id === newItem.id)
        );
        return [...prev, ...newItems];
      });
      
      setHasMore((nextPage * PAGE_SIZE) < total);
      setCurrentPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more opportunities');
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, hasMore, currentPage]);

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
        { root: null, rootMargin: "100px", threshold: 0.1 } // Increased margin
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
        // Keep existing loaded items if they match the current sort
        const sortedData = [...allData].sort((a, b) => 
          sortOrder === "asc" 
            ? new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
            : new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        );
        
        setOpportunities(sortedData.slice(0, currentPage * PAGE_SIZE));
        setHasMore(sortedData.length > currentPage * PAGE_SIZE);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sort opportunities');
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
    sortOpportunities(); // Actually trigger the sort
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
      
      // Refresh data after creation
      await loadInitialData();
      setIsCreateFormOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create opportunity';
      setError(message);
      console.error('Creation error:', err);
    }
  };

  // Get first/last ending opportunities
  const [firstEndingOpportunity, lastEndingOpportunity] = useMemo(() => {
    if (opportunities.length === 0) return [null, null];
    return sortOrder === "asc" 
      ? [opportunities[0], opportunities[opportunities.length - 1]]
      : [opportunities[opportunities.length - 1], opportunities[0]];
  }, [opportunities, sortOrder]);

  if (loading) return <div className={styles.loading}>Loading opportunities...</div>;
  
  if (error) return (
    <div className={styles.error}>
      <div className={styles.errorIcon}>⚠️</div>
      Error: {error}
      <button className={styles.retryButton} onClick={loadInitialData}>
        Retry
      </button>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
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
              className={styles.addButton} 
              onClick={() => setIsCreateFormOpen(true)}
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
              cursor: "pointer",
              minHeight: "200px"
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

    {/* Create Form Modal */}
    {isCreateFormOpen && (
      <CreateForm
        onClose={() => setIsCreateFormOpen(false)}
        onCreateOpportunity={handleCreateOpportunity}
        isOnline={networkStatus.isOnline && networkStatus.isServerAvailable}
      />
    )}
  </div> {/* This closes the listLayout div */}
</div>
  );
};

export default OpportunitiesPage;