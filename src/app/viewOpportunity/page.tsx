"use client";
import React, {useState, useEffect} from "react";
import Image from "next/image";
import styles from "./ViewOpportunity.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import Logo from "../../utils/images/logo.png";
import { useOpportunities } from "@/context/OpportunitiesContext";
import UpdateForm from "../updateForm/page";

const ViewOpportunity = () => {
  // Mock data for volunteers
  const volunteers = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Volunteer ${i + 1}`,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/9d8e64396669c6ea401e6c2cd0d94845d95c27cc6f67f5d539746b3e7fe6c248?placeholderIfAbsent=true",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/20b7661fb92611d238b93ab28d142bfd2051614c07bcc4980f08cb5e6585bb85?placeholderIfAbsent=true",
  }));

  const [opportunityData, setOpportunityData] = useState({
    title: "",
    organizer: "",
    shortDescription: "",
    description: "",
    image: "",
  });
  const router = useRouter();





  const { deleteOpportunity,updateOpportunity } = useOpportunities();
  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this opportunity?");
    if (confirmDelete) {
      deleteOpportunity(title);
      router.push("/opportunities"); // Redirect to opportunities list
    }
  };



  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Default Title";
  const organizer = searchParams.get("organizer") || "Unknown Organizer";
  const shortDescription = searchParams.get("shortdesc") || "short description fail";
  const description = searchParams.get("description") || "Description fails";
  const image = searchParams.get("image") || "https://via.placeholder.com/150";
  

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedOrganizer, setUpdatedOrganizer] = useState(organizer);
  const [updatedShortDesc, setUpdatedShortDesc] = useState(shortDescription);
  const [updatedDesc, setUpdatedDesc] = useState(description);


   // Initial state with search parameters
   useEffect(() => {
    setOpportunityData({
      title,
      organizer,
      shortDescription,
      description,
      image,
    });
  }, [title, organizer, shortDescription, description, image]);


const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
  console.log(e);
  
  updateOpportunity(title, {
    title: updatedTitle,
    organizer: updatedOrganizer,
    shortDescription: updatedShortDesc,
    description: updatedDesc,
    image,
  });

  opportunityData.title = updatedTitle;
  opportunityData.organizer = updatedOrganizer;
  opportunityData.shortDescription = updatedShortDesc;
  opportunityData.description = updatedDesc;

  setShowUpdateModal(false);
};

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.leadingIcon}>
          <div className={styles.iconContainer}>
            <div className={styles.stateLayer}>
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c76676ff7d6690a155f3e947df80d6723a547e344e83ee13acb153937a49b6e?placeholderIfAbsent=true"
                alt="Back"
                width={24}
                height={24}
                className={styles.iconImage}
              />
            </div>
          </div>
        </div>
        <div className={styles.headline}>{opportunityData.title}</div>
        <Image
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/2929f59dbf6efd59351a8cda622cc9ca1b61f439c0591fe95abe22ef7ddf7310?placeholderIfAbsent=true"
          alt="Logo"
          width={96}
          height={48}
          className={styles.logoImage}
        />
      </div>

      <div className={styles.header}>
        <Image
          src={Logo.src}
          alt="Opportunity"
          width={216}
          height={216}
          className={styles.headerImage}
        />
        <div className={styles.contentWrapper}>
          <div className={styles.headlineContent}>
            <div className={styles.opportunityTitle}>Volunteer Oportunity</div>
            <div className={styles.publishedDate}>Published date</div>
            <div className={styles.supportingText}> {opportunityData.shortDescription}
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button className={`${styles.button} ${styles.buttonUpdate}`} onClick={() => setShowUpdateModal(true)}>
              Update
            </button>
            <button className={`${styles.button} ${styles.buttonDelete}`} onClick={handleDelete}>
              Delete
            </button>
            <button className={`${styles.button} ${styles.buttonApply}`} >
              APPLY
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Organizer</div>
          <div className={styles.leadingIcon}>
            <div className={styles.iconContainer}>
              <div className={styles.stateLayer}>
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/d85cc389d575d1c745432ced908ae74c42a36354e058c8c03f0993604723707f?placeholderIfAbsent=true"
                  alt="More"
                  width={24}
                  height={24}
                  className={styles.iconImage}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.organizerCard}>
          <div className={styles.organizerContent}>
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/edf2578a1f1de7bd15c651bfa54047659a7e892107e0375b07822e89c5b0b2be?placeholderIfAbsent=true"
              alt="Organizer"
              width={120}
              height={120}
              className={styles.organizerImage}
            />
            <div className={styles.organizerInfo}>
              <div className={styles.organizerName}>{opportunityData.organizer}</div>
              <div className={styles.organizerDescription}>
                Organizer short description
              </div>
              <div className={styles.organizerMeta}>
                <div className={styles.metaInfo}>
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/c72d7454873655f9bc5121e1ca8d3e63c4e2ebb32e0be176010ae51dbba4c8a5?placeholderIfAbsent=true"
                    alt="Calendar"
                    width={24}
                    height={24}
                    className={styles.metaIcon}
                  />
                  <div className={styles.metaText}>Join Date</div>
                  <div className={styles.separator}>•</div>
                  <div className={styles.metaTime}>23 min</div>
                </div>
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b8a15172d10d9958fd471575e210405265b5373fd10ca96d467e5ff67100e17?placeholderIfAbsent=true"
                  alt="More"
                  width={24}
                  height={24}
                  className={styles.metaIcon}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Description</div>
          <div className={styles.leadingIcon}>
            <div className={styles.iconContainer}>
              <div className={styles.stateLayer}>
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/d85cc389d575d1c745432ced908ae74c42a36354e058c8c03f0993604723707f?placeholderIfAbsent=true"
                  alt="More"
                  width={24}
                  height={24}
                  className={styles.iconImage}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.organizerCard}>
          <div className={styles.organizerContent}>
            <div className={styles.organizerInfo}>
              <div className={styles.organizerName}>
                {opportunityData.description}
              </div>
              <div className={styles.organizerMeta}>
                <div className={styles.metaInfo}>
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/c72d7454873655f9bc5121e1ca8d3e63c4e2ebb32e0be176010ae51dbba4c8a5?placeholderIfAbsent=true"
                    alt="Calendar"
                    width={24}
                    height={24}
                    className={styles.metaIcon}
                  />
                  <div className={styles.metaText}>Today</div>
                  <div className={styles.separator}>•</div>
                  <div className={styles.metaTime}>23 min</div>
                </div>
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b8a15172d10d9958fd471575e210405265b5373fd10ca96d467e5ff67100e17?placeholderIfAbsent=true"
                  alt="More"
                  width={24}
                  height={24}
                  className={styles.metaIcon}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Informations</div>
          <div className={styles.leadingIcon}>
            <div className={styles.iconContainer}>
              <div className={styles.stateLayer}>
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/d85cc389d575d1c745432ced908ae74c42a36354e058c8c03f0993604723707f?placeholderIfAbsent=true"
                  alt="More"
                  width={24}
                  height={24}
                  className={styles.iconImage}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.infoSection}>
          <div className={styles.infoText}>
            Posted date:
            <br />
          </div>
          <div className={styles.infoItem}>Starting date - Finish date:</div>
          <div className={styles.infoItem}>Number of Members:</div>
          <div className={styles.infoItem}>Location:</div>
          <div className={styles.infoItem}>Fee payment:</div>
          <div className={styles.infoItem}>Age Region:</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>Members In Project</div>
          <div className={styles.leadingIcon}>
            <div className={styles.iconContainer}>
              <div className={styles.stateLayer}>
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/d85cc389d575d1c745432ced908ae74c42a36354e058c8c03f0993604723707f?placeholderIfAbsent=true"
                  alt="More"
                  width={24}
                  height={24}
                  className={styles.iconImage}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.membersCarousel}>
          <div className={styles.carouselContent}>
            {volunteers.map((volunteer) => (
              <div key={volunteer.id} className={styles.memberItem}>
                <div className={styles.memberImageContainer}>
                  <Image
                    src={volunteer.image}
                    alt={`Background ${volunteer.name}`}
                    width={96}
                    height={96}
                    className={styles.memberImageBackground}
                  />
                  <Image
                    src={volunteer.avatar}
                    alt={volunteer.name}
                    width={96}
                    height={96}
                    className={styles.memberImage}
                  />
                </div>
                <div className={styles.memberName}>{volunteer.name}</div>
              </div>
            ))}
            <div className={styles.addMemberItem}>
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/7f7e41eb3d277b2a10d97fbb8723c9dc316e4726cef38d3cb8378382584a28d0?placeholderIfAbsent=true"
                alt="Add Volunteer"
                width={96}
                height={96}
                className={styles.addMemberImage}
              />
              <div className={styles.memberName}>Add Volunteer</div>
            </div>
          </div>
        </div>
      </div>
      {showUpdateModal && (
        <UpdateForm
          onClose={() => setShowUpdateModal(false)}
          onUpdateOpportunity={handleUpdate}
          updatedTitle={updatedTitle}
          updatedOrganizer={updatedOrganizer}
          updatedShortDesc={updatedShortDesc}
          updatedDesc={updatedDesc}
          setUpdatedTitle={setUpdatedTitle}
          setUpdatedOrganizer={setUpdatedOrganizer}
          setUpdatedShortDesc={setUpdatedShortDesc}
          setUpdatedDesc={setUpdatedDesc}
        />
      )}
    </div>

    
  );
  
};

export default ViewOpportunity;
