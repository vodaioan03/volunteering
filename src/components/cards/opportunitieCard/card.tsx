"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons"; // Replace with your icon
import styles from "./Card.module.css";
import { useRouter } from "next/navigation"; // Import useRouter

export interface CardProps {
    image: string;
    name: string;
    organizer: string;
    views: string;
    endDate: string;
    shortDescription?: string; // Optional: Add if needed
    description?: string; // Optional: Add if needed
}

const Card: React.FC<CardProps> = ({ image, name, organizer, views, endDate, shortDescription = "", description = "" }) => {
    const router = useRouter(); // Initialize the router

    // Handle card click
    const handleCardClick = () => {
        router.push(
            `/viewOpportunity?title=${encodeURIComponent(name)}&organizer=${encodeURIComponent(
                organizer
            )}&shortdesc=${encodeURIComponent(shortDescription)}&description=${encodeURIComponent(
                description
            )}&image=${encodeURIComponent(image)}`
        );
    };

    return (
        <div className={styles.card} onClick={handleCardClick}>
            <img src={image} alt="Event Image" className={styles.cardImage} />
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{name}</h3>
                <p className={styles.cardOrganizer}>Organized by: {organizer}</p>
                <div className={styles.cardDetails}>
                    <div className={styles.cardViews}>
                        <FontAwesomeIcon icon={faEye} />
                        <span>{views} Views</span>
                    </div>
                    <p className={styles.cardEndDate}>Ends: {endDate}</p>
                </div>
            </div>
        </div>
    );
};

export default Card;