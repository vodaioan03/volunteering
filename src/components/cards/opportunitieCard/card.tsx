"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import styles from "./Card.module.css";
import { useRouter } from "next/navigation";
import { opportunityService } from "@/services/opportunities"
import { useAuth } from "@/context/AuthContext";

export interface CardProps {
    id?: string;
    image: string;
    name: string;
    organizer: string;
    views: string;
    endDate: string;
    shortDescription?: string;
    description?: string;
}

const Card: React.FC<CardProps> = ({ id, image, name, organizer, views, endDate, shortDescription = "", description = "" }) => {
    const router = useRouter();
    const { userId, isLoading } = useAuth();
    const [canApply, setCanApply] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        if (id && userId && !isLoading) {
            opportunityService.checkCanApply(id, userId);
        }
    }, [id, userId, isLoading]);
    const handleCardClick = () => {
        router.push(`/viewOpportunity?id=${id}`);
    };

    const handleApplyClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (!id || !userId || !canApply) return;

        setIsApplying(true);
        try {
            await opportunityService.applyForOpportunity(id, userId);
            // Update UI to show success
            setCanApply(false); // User has now applied
            alert("Application submitted successfully!");
        } catch (error) {
            console.error("Error applying:", error);
            alert("There was an error submitting your application. Please try again.");
        } finally {
            setIsApplying(false);
        }
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
                {canApply && (
                    <button 
                        className={styles.applyButton} 
                        onClick={handleApplyClick}
                        disabled={isApplying}
                    >
                        {isApplying ? "Applying..." : "Apply"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Card;