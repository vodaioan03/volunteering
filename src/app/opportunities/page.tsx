"use client"
import React, { useState, useEffect } from "react";
import styles from "./Products.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CreateForm from "../createForm/page";
import Logo from "../../utils/images/logo.png";
import { useRouter } from "next/navigation"; // Import useRouter
import { useOpportunities } from "@/context/OpportunitiesContext";


interface Organization {
  name: string;
  logo: string;  // This will now be a string URL or StaticImageData
}

interface Volunteer {
  name: string;
  avatar: string;  // This will now be a string URL or StaticImageData
}

interface Opportunity {
  title: string;
  organizer: string;
  shortDescription:string;
  description:string;
  image: string;  // This will now be a string URL or StaticImageData
}

const ProductsPage = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<{ type: string; data: any }>({ type: "", data: null });

  const { opportunities, addOpportunity } = useOpportunities(); // Get global opportunities state

  const handleOpportunityClick = (opp: Opportunity) => {
    router.push(`/viewOpportunity?title=${encodeURIComponent(opp.title)}&organizer=${encodeURIComponent(opp.organizer)}&shortdesc=${encodeURIComponent(opp.shortDescription)}&description=${encodeURIComponent(opp.description)}&image=${encodeURIComponent(opp.image)}`);
  };

  const [organizations, setOrganizations] = useState<Organization[]>([
    { name: "Org 1", logo: Logo.src },
    { name: "Org 2", logo: Logo.src },
    { name: "Org 3", logo: Logo.src },
  ]);

  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    { name: "Volunteer 1", avatar: Logo.src },
    { name: "Volunteer 2", avatar: Logo.src },
    { name: "Volunteer 3", avatar: Logo.src },
  ]);

  const [sortedOpportunities, setSortedOpportunities] = useState<Opportunity[]>([]);
  const [sortAscending, setSortAscending] = useState<boolean>(true); // State to track sorting order

  useEffect(() => {
    setSortedOpportunities(opportunities);
  }, [opportunities]);

  // Sort opportunities based on the current sort order
  const handleSortAlphabetically = () => {
    const sorted = [...sortedOpportunities].sort((a, b) => {
      return sortAscending
        ? a.title.localeCompare(b.title)  // Ascending order
        : b.title.localeCompare(a.title); // Descending order
    });
    setSortedOpportunities(sorted);
    setSortAscending(!sortAscending); // Toggle the sort order for next click
  };


  const handleAddClick = (type: string) => {
    setNewItem({ type, data: null });
    setShowModal(true);
  };

  const handleAddNewItem = (data: any) => {
    if (newItem.type === "organization") {
      setOrganizations([...organizations, { name: data.organizationName, logo: Logo.src }]);
    } else if (newItem.type === "volunteer") {
      setVolunteers([...volunteers, { name: data.organizationName, avatar: Logo.src }]); // Placeholder for avatar
    } else if (newItem.type === "opportunity") {
      addOpportunity({
        title: data.opportunityName,
        organizer: data.organizationName,
        shortDescription: data.shortDescription,
        description: data.description,
        image: Logo.src, // You can modify this to use a relevant image for the opportunity
      });
    }
    setShowModal(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>Opportunities</h1>
        </div>

        <div className={styles.contentArea}>
          {/* Popular Organizations Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Popular Organizations</h2>
              <button className={styles.moreButton} onClick={() => handleAddClick("organization")}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <div className={styles.organizationsCarousel}>
              {organizations.map((org, index) => (
                <div key={index} className={styles.organizationCard}>
                  <div className={styles.avatarContainer}>
                    <Image
                      src={org.logo}
                      alt={`Organization ${index + 1}`}
                      width={96}
                      height={96}
                      className={styles.avatarImage}
                    />
                  </div>
                  <div className={styles.organizationName}>{org.name}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Volunteers Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Popular Volunteers</h2>
              <button className={styles.moreButton} onClick={() => handleAddClick("volunteer")}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <div className={styles.volunteersCarousel}>
              {volunteers.map((vol, index) => (
                <div key={index} className={styles.volunteerCard}>
                  <div className={styles.avatarContainer}>
                    <Image
                      src={vol.avatar}
                      alt={`Volunteer ${index + 1}`}
                      width={96}
                      height={96}
                      className={styles.avatarImage}
                    />
                  </div>
                  <div className={styles.volunteerName}>{vol.name}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Opportunities Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Opportunities</h2>
              <button className={styles.moreButton} onClick={() => handleAddClick("opportunity")}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button className={styles.sortButton} onClick={handleSortAlphabetically}>
                {sortAscending ? "Sort Alphabetically" : "Sort Descending"}
              </button>
            </div>
            <div className={styles.opportunitiesCarousel}>
              {sortedOpportunities.map((opp, index) => (
                <div key={index} onClick={() => handleOpportunityClick(opp)} className={styles.opportunityCard}>
                  <div className={styles.opportunityImageContainer}>
                    <Image src={opp.image} alt={opp.title} width={116} height={116} className={styles.opportunityImage} />
                  </div>
                  <div className={styles.opportunityInfo}>
                    <div className={styles.opportunityTitle}>{opp.title}</div>
                    <div className={styles.organizerName}>{opp.organizer}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Render Modal */}
      {showModal && <CreateForm onClose={() => setShowModal(false)} onCreateOpportunity={handleAddNewItem} />}
    </div>
  );
};

export default ProductsPage;
