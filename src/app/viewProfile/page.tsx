"use client";
import React, { useState, useEffect } from "react";
import styles from "./ViewProfile.module.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faCheck, faTimes, faLock } from "@fortawesome/free-solid-svg-icons";
import { profileService, UserProfile, ProfileUpdateDto } from "@/services/profileService";
import { useError } from "@/context/ErrorContext";
import TwoFactorSetup from "@/components/twoFactorSetup/TwoFactorSetup";

const ViewProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { showError } = useError();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, [isAuthenticated, user]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      const data = await profileService.getProfile();
      console.log('Profile data received:', { ...data, has2FAEnabled: data.has2FAEnabled });
      setProfile(data);
      setEditedProfile(data);
    } catch (err) {
      console.error('Profile fetch error:', err);
      showError(err instanceof Error ? err.message : 'Failed to load profile');
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
      setIsLoading(true);
      await profileService.updateProfile(editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSetupSuccess = () => {
    console.log('2FA setup completed successfully, refreshing profile...');
    setShowTwoFactorSetup(false);
    fetchProfile(); // Refresh profile to get updated 2FA status
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (!profile) {
    return <div className={styles.error}>Profile not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile</h1>

      <div className={styles.profileSection}>
        <div className={styles.field}>
          <label>First Name:</label>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile?.firstName || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev!, firstName: e.target.value }))}
              className={styles.input}
            />
          ) : (
            <span>{profile.firstName}</span>
          )}
        </div>

        <div className={styles.field}>
          <label>Last Name:</label>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile?.lastName || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev!, lastName: e.target.value }))}
              className={styles.input}
            />
          ) : (
            <span>{profile.lastName}</span>
          )}
        </div>

        <div className={styles.field}>
          <label>Email:</label>
          <span>{profile.email}</span>
        </div>

        <div className={styles.field}>
          <label>Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              name="phoneNumber"
              value={editedProfile?.phoneNumber || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev!, phoneNumber: e.target.value }))}
              className={styles.input}
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
              onChange={(e) => setEditedProfile(prev => ({ ...prev!, birthDate: e.target.value }))}
              className={styles.input}
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
              onChange={(e) => setEditedProfile(prev => ({ 
                ...prev!, 
                gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER' | undefined 
              }))}
              className={styles.input}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          ) : (
            <span>{profile.gender || 'Not provided'}</span>
          )}
        </div>

        <div className={styles.securitySection}>
          <h2>Security Settings</h2>
          <div className={styles.twoFactorStatus}>
            <FontAwesomeIcon icon={faLock} className={styles.securityIcon} />
            <span>Two-Factor Authentication:</span>
            <span className={profile.has2FAEnabled ? styles.enabled : styles.disabled}>
              {profile.has2FAEnabled ? 'Enabled' : 'Disabled'}
            </span>
            {!profile.has2FAEnabled && (
              <button
                className={styles.enableButton}
                onClick={() => setShowTwoFactorSetup(true)}
              >
                Enable 2FA
              </button>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button onClick={handleSave} className={styles.saveButton}>
                <FontAwesomeIcon icon={faCheck} /> Save
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEdit} className={styles.editButton}>
              <FontAwesomeIcon icon={faPencilAlt} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {showTwoFactorSetup && (
        <TwoFactorSetup
          onClose={() => setShowTwoFactorSetup(false)}
          onSuccess={handleTwoFactorSetupSuccess}
        />
      )}
    </div>
  );
};

export default ViewProfile;
