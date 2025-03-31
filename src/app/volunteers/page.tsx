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
  const [sortedOpportunities, setSortedOpportunities] = useState<Opportunity[]>([]);
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
  const [showLoading, setShowLoading] = useState(false);
  
  // Sliding window state
  const [windowStart, setWindowStart] = useState(0);
  const windowSize = 10;
  const loadMoreThreshold = 5;
  
  const observer = useRef<IntersectionObserver | null>(null);

  // Check network status periodically
  useEffect(() => {
    const checkStatus = async () => {
      const newStatus = await opportunityService.checkNetworkStatus();
      
      // Only update state if status actually changed
      if (newStatus.isOnline !== networkStatus.isOnline || 
          newStatus.isServerAvailable !== networkStatus.isServerAvailable) {
        setNetworkStatus(newStatus);
        
        // Only refresh if we've come back online
        if ((newStatus.isOnline && newStatus.isServerAvailable) && 
            (!networkStatus.isOnline || !networkStatus.isServerAvailable)) {
          await opportunityService.syncOfflineOperations();
          loadOpportunities(); // Refresh data after coming back online
        }
      }
    };
  
    const interval = setInterval(checkStatus, 5000);
    checkStatus(); // Initial check
    
    return () => clearInterval(interval);
  }, [networkStatus]); // Add networkStatus as dependency

  // Fetch initial opportunities
  const loadOpportunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await opportunityService.getAll();
      setOpportunities(data);
      setSortedOpportunities(data.slice(0, windowSize));
      setHasMore(data.length > windowSize);
      
      // Check if we're using cached data
      const status = await opportunityService.checkNetworkStatus();
      if (!status.isOnline || !status.isServerAvailable) {
        // Optional: Show a subtle indicator that offline data is being shown
        console.log('Showing cached opportunities data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load opportunities';
      setError(errorMessage);
      
      // Even if error occurs, try to show cached data
      try {
        const cachedData = opportunityService.getCachedData();
        if (cachedData.length > 0) {
          setOpportunities(cachedData);
          setSortedOpportunities(cachedData.slice(0, windowSize));
          setHasMore(cachedData.length > windowSize);
          console.log('Fell back to cached data after error');
        }
      } catch (cacheError) {
        console.error('Failed to load cached data:', cacheError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load more opportunities when scrolling
  const loadMoreOpportunities = useCallback(async () => {
    if (isFetching || !hasMore) return;
    
    setIsFetching(true);
    setShowLoading(true);
    const minLoadTime = 500;

    try {
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, minLoadTime)),
        (async () => {
          const newWindowStart = windowStart + windowSize;
          const newData = opportunities.slice(newWindowStart, newWindowStart + windowSize);
          
          if (newData.length === 0) {
            setHasMore(false);
            return;
          }
          
          setSortedOpportunities(prev => [...prev, ...newData]);
          setWindowStart(newWindowStart);
        })()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more opportunities');
    } finally {
      setShowLoading(false);
      setIsFetching(false);
    }
  }, [isFetching, hasMore, opportunities, windowStart, windowSize]);

  // Observer callback
  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (isFetching) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }

    if (node) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isFetching) {
            loadMoreOpportunities();
          }
        },
        { root: null, rootMargin: "20px", threshold: 0.1 }
      );
      observer.current.observe(node);
    }
  }, [isFetching, hasMore, loadMoreOpportunities]);

  // Cleanup observer
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // Initial load
  useEffect(() => {
    loadOpportunities();
  }, []);

  // Sort opportunities
  const sortOpportunities = async () => {
    try {
      setLoading(true);
      const data = sortOrder === "asc" 
        ? await opportunityService.getAscending() 
        : await opportunityService.getDescending();
      setOpportunities(data);
      setSortedOpportunities(data.slice(0, windowSize));
      setWindowStart(0);
      setHasMore(data.length > windowSize);
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

  // Handle opportunity creation with offline support
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

  // Get first/last ending opportunities from the full sorted list
  const [firstEndingOpportunity, lastEndingOpportunity] = useMemo(() => {
    if (opportunities.length === 0) return [null, null];
    return sortOrder === "asc" 
      ? [opportunities[0], opportunities[opportunities.length - 1]]
      : [opportunities[opportunities.length - 1], opportunities[0]];
  }, [opportunities, sortOrder]);

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
          {sortedOpportunities.map((opp, index) => {
            const isFirstEnding = opp.id === firstEndingOpportunity?.id;
            const isLastEnding = opp.id === lastEndingOpportunity?.id;
            const isLastItem = index === sortedOpportunities.length - 1;

            return (
              <div 
                key={`${opp.id}-${index}`}
                ref={isLastItem ? lastItemRef : null}
                onClick={() => handleOpportunityClick(opp)}
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
                  isOffline={!!opp.isOffline}
                />
              </div>
            );
          })}
        </div>
        
        {/* Loading indicators */}
        {(showLoading || isFetching) && (
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