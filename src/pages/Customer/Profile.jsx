import React, { useState, useEffect, useMemo } from 'react';
import { getUserProfile, updateUserProfile } from '../../utils/api';
import './Profile.css';

const CustomerProfile = () => {
  const defaultProfile = useMemo(() => ({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    joinDate: new Date(),
    orderStats: {
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      lastOrderDate: null
    }
  }), []);

  // State declarations
  const [profile, setProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });

  // Profile fetch
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile({
          ...defaultProfile,
          ...data,
          joinDate: data.joinDate ? new Date(data.joinDate) : defaultProfile.joinDate
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [defaultProfile]);

  // Handler functions
  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({});
    setUpdateStatus({ type: '', message: '' });
  };

  const handleSave = async () => {
    try {
      setUpdateStatus({ type: 'loading', message: 'Saving changes...' });
      const updatedData = await updateUserProfile(editedProfile);
      setProfile(updatedData);
      setIsEditing(false);
      setUpdateStatus({ type: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => setUpdateStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setUpdateStatus({ type: 'error', message: err.message || 'Failed to update profile' });
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-summary">
          <h1>{profile.name}</h1>
          <div className="profile-badges">
            <span className="badge member-since">
              Member since {formatDate(profile.joinDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons and status message */}
      <div className="profile-actions">
        {!isEditing ? (
          <button className="edit-btn" onClick={handleEdit}>
            <i className="fas fa-edit"></i> Edit Profile
          </button>
        ) : (
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>
              <i className="fas fa-check"></i> Save Changes
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        )}
      </div>

      {updateStatus.message && (
        <div className={`status-message ${updateStatus.type}`}>
          {updateStatus.message}
        </div>
      )}

      <div className="profile-grid">
        {/* Personal Information Card */}
        <div className="profile-card personal-info">
          <h2>Personal Information</h2>
          <div className="info-grid">
            {isEditing ? (
              <>
                <div className="info-item">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editedProfile.name || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      name: e.target.value
                    })}
                  />
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={editedProfile.phone || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      phone: e.target.value
                    })}
                  />
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editedProfile.email || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      email: e.target.value
                    })}
                    disabled
                  />
                </div>
              </>
            ) : (
              <>
                <div className="info-item">
                  <i className="fas fa-user"></i>
                  <label>Name</label>
                  <span>{profile.name}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-phone"></i>
                  <label>Phone</label>
                  <span>{profile.phone || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-envelope"></i>
                  <label>Email</label>
                  <span>{profile.email}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Order Statistics Card */}
        <div className="profile-card order-statistics">
          <h2>Order Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <i className="fas fa-shopping-bag"></i>
              <div className="stat-content">
                <label>Total Orders</label>
                <span>{profile.orderStats.totalOrders}</span>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-rupee-sign"></i>
              <div className="stat-content">
                <label>Total Spent</label>
                <span>{formatCurrency(profile.orderStats.totalSpent)}</span>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-chart-line"></i>
              <div className="stat-content">
                <label>Average Order</label>
                <span>{formatCurrency(profile.orderStats.averageOrderValue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;