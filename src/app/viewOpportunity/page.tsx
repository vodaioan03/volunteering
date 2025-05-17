"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./ViewOpportunity.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import { Opportunity } from "@/types/opportunity";
import { opportunityService } from "@/services/opportunities";
import UpdateForm from "../updateForm/UpdateForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTrash, faCalendar, faUsers, faInfoCircle, faPaperclip, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useError } from "@/context/ErrorContext";
import { useAuth } from "@/context/AuthContext";

const ViewOpportunity = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError } = useError();
  const { isAuthenticated } = useAuth();
  const id = searchParams.get("id") || "";
  
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousStateRef = useRef<Opportunity | null>(null);

  // Fetch opportunity data and attachments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await opportunityService.getById(id);
        setOpportunity(data);
        
        // Fetch attachments if your API supports it
        const attachmentsData = await opportunityService.getAttachments(id);
        setAttachments(attachmentsData);
      } catch (error) {
        if (error instanceof Error) {
          showError(error.message);
        } else {
          showError('Failed to load opportunity');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, showError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !id) return;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("opportunityId", id);

      setUploadProgress(50);

      const response = await opportunityService.uploadAttachment(
        id,
        formData
      );

      // Add the new attachment to the list
      setAttachments([...attachments, response]);
      setSelectedFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to upload file');
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const response = await opportunityService.downloadAttachment(id, fileId);
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to download file');
    }
  };

  const handleUpdateClick = () => {
    if (!isAuthenticated) {
      showError("Please log in to update opportunities");
      return;
    }
    setShowUpdateModal(true);
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      showError("Please log in to delete opportunities");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this opportunity?");
    if (confirmDelete) {
      try {
        await opportunityService.delete(id);
        router.push("/volunteers");
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Failed to delete opportunity');
      }
    }
  };

  const handleUpdate = async (updatedData: { [key: string]: string }) => {
    try {
      if (!id) {
        showError('No opportunity ID found');
        return;
      }

      // Store the previous state in case we need to revert
      previousStateRef.current = opportunity;
      
      // Show optimistic update
      setOpportunity(prev => prev ? {
        ...prev,
        title: updatedData.name,
        organizer: updatedData.organizer,
        shortDescription: updatedData.shortDescription,
        image: updatedData.image,
        endDate: updatedData.endDate
      } : null);
      
      // Close modal
      setShowUpdateModal(false);

      // Attempt the update
      await opportunityService.update(
        id,
        {
          title: updatedData.name,
          organizer: updatedData.organizer,
          shortDescription: updatedData.shortDescription,
          description: opportunity?.description || "",
          image: updatedData.image,
          endDate: updatedData.endDate
        }
      );

      // If successful, fetch fresh data
      const refreshedData = await opportunityService.getById(id);
      setOpportunity(refreshedData);
    } catch (error) {
      // Revert to previous state on error
      setOpportunity(previousStateRef.current);
      
      if (error instanceof Error) {
        showError(error.message);
        // Reopen modal if there was a validation error
        setShowUpdateModal(true);
      } else {
        showError('Failed to update opportunity');
      }
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!opportunity) return <div className={styles.notFound}>Opportunity not found</div>;

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
          src={opportunity.image}
          alt="Opportunity Image"
          width={150}
          height={150}
          className={styles.headerImage}
        />
        <h1 className={styles.headerTitle}>{opportunity.title}</h1>
        <p className={styles.headerDescription}>{opportunity.shortDescription}</p>
        <div className={styles.headerButtons}>
          <button
            className={`${styles.headerButton} ${styles.headerButtonUpdate} ${!isAuthenticated ? styles.headerButtonDisabled : ''}`}
            onClick={handleUpdateClick}
          >
            Update
          </button>
          <button
            className={`${styles.headerButton} ${styles.headerButtonDelete} ${!isAuthenticated ? styles.headerButtonDisabled : ''}`}
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
          <p className={styles.organizerName}>{opportunity.organizer}</p>
        </div>
      </div>

      {/* Description Section */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>Description</h2>
        <p className={styles.descriptionText}>{opportunity.description}</p>
      </div>

      {/* File Upload Section */}
      <div className={styles.fileUploadSection}>
        <h2 className={styles.sectionTitle}>Attachments</h2>
        <div className={styles.uploadArea}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={styles.uploadButton}
          >
            <FontAwesomeIcon icon={faPaperclip} /> Select File
          </button>
          {selectedFile && (
            <div className={styles.fileInfo}>
              <span>{selectedFile.name}</span>
              <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
              {uploadProgress === 0 && (
                <button 
                onClick={handleUpload} 
                className={styles.uploadSubmitButton} 
                id={selectedFile.name}>
                  Upload
                </button>
              )}
            </div>
            
          )}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span>{uploadProgress}%</span>
            </div>
          )}
        </div>

        {/* Attachments List */}
        {attachments.length > 0 && (
          <div className={styles.attachmentsList}>
            {attachments.map((file) => (
              <div key={file.id} className={styles.attachmentItem}>
                <span>{file.fileName}</span>
                <button 
                  onClick={() => handleDownload(file.id, file.fileName)}
                  className={styles.downloadButton}
                >
                  <FontAwesomeIcon icon={faDownload} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Information Section */}
      <div className={styles.informationSection}>
        <h2 className={styles.informationTitle}>Information</h2>
        <div className={styles.informationGrid}>
          <div className={styles.informationItem}>
            <FontAwesomeIcon icon={faCalendar} className={styles.infoIcon} />
            <p className={styles.infoText}>End Date: {opportunity.endDate}</p>
          </div>
          <div className={styles.informationItem}>
            <FontAwesomeIcon icon={faUsers} className={styles.infoIcon} />
            <p className={styles.infoText}>Views: {opportunity.views}</p>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <UpdateForm
          onClose={() => setShowUpdateModal(false)}
          onUpdateOpportunity={handleUpdate}
          initialData={{
            name: opportunity.title,
            organizer: opportunity.organizer,
            shortDescription: opportunity.shortDescription,
            endDate: opportunity.endDate,
            image: opportunity.image,
          }}
        />
      )}
    </div>
  );
};

export default ViewOpportunity;