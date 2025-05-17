"use client";
import React, { useState, useEffect } from "react";
import styles from "./ViewProfile.module.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { profileService, UserProfile, ProfileUpdateDto } from "@/services/profileService";

const ViewProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, [isAuthenticated, user]);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setEditedProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      const updateData: ProfileUpdateDto = {
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        phoneNumber: editedProfile.phoneNumber,
        birthDate: editedProfile.birthDate,
        gender: editedProfile.gender,
        address: editedProfile.address,
        city: editedProfile.city,
        state: editedProfile.state,
        country: editedProfile.country,
        zipCode: editedProfile.zipCode
      };

      const updatedProfile = await profileService.updateProfile(updateData);
      setProfile(updatedProfile);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editedProfile) return;

    const { name, value } = e.target;
    setEditedProfile(prev => prev ? ({
      ...prev,
      [name]: value
    }) : null);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!profile) {
    return <div className={styles.error}>Profile not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Profile</h1>
        {!isEditing ? (
          <button onClick={handleEdit} className={styles.editButton}>
            <FontAwesomeIcon icon={faPencilAlt} /> Edit Profile
          </button>
        ) : (
          <div className={styles.editActions}>
            <button onClick={handleSave} className={styles.saveButton}>
              <FontAwesomeIcon icon={faCheck} /> Save
            </button>
            <button onClick={handleCancel} className={styles.cancelButton}>
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Personal Information</h2>
          <div className={styles.field}>
            <label>First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={editedProfile?.firstName || ''}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.firstName}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={editedProfile?.lastName || ''}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.lastName}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <span>{profile.email}</span>
          </div>

          <div className={styles.field}>
            <label>Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="phoneNumber"
                value={editedProfile?.phoneNumber || ''}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.phoneNumber || 'Not provided'}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Birth Date</label>
            {isEditing ? (
              <input
                type="date"
                name="birthDate"
                value={editedProfile?.birthDate || ''}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.birthDate || 'Not provided'}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Gender</label>
            {isEditing ? (
              <select
                name="gender"
                value={editedProfile?.gender || ''}
                onChange={handleChange}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            ) : (
              <span>{profile.gender || 'Not provided'}</span>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Address Information</h2>
          <div className={styles.field}>
            <label>Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={editedProfile?.address || ''}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.address || 'Not provided'}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>City</label>
            {isEditing ? (
              <input
                type="text"
                name="city"
                value={editedProfile?.city || ''}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.city || 'Not provided'}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>State</label>
            {isEditing ? (
              <input
                type="text"
                name="state"
                value={editedProfile?.state || ''}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.state || 'Not provided'}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Country</label>
            {isEditing ? (
              <input
                type="text"
                name="country"
                value={editedProfile?.country || ''}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.country || 'Not provided'}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>ZIP Code</label>
            {isEditing ? (
              <input
                type="text"
                name="zipCode"
                value={editedProfile?.zipCode || ''}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.zipCode || 'Not provided'}</span>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Account Information</h2>
          <div className={styles.field}>
            <label>Role</label>
            <span>{profile.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
