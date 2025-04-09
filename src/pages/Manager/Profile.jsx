import React, { useState, useEffect, useMemo } from 'react';
import { getManagerProfile } from '../../utils/api';
import './Profile.css';

const ManagerProfile = () => {
  const defaultProfile = useMemo(() => ({
    name: '',
    email: '',
    phone: '',
    employeeId: 'MGR-2024',
    designation: 'Senior Store Manager',
    department: 'Store Operations',
    joinDate: new Date('2022-01-01'),
    experience: '5 years',
    expertise: ['Inventory Management', 'Team Leadership', 'Customer Service', 'Sales Analytics'],
    productsManaged: 0,
    ordersProcessed: 0,
    totalRevenue: 0,
    teamSize: 15,
    certifications: [
      { name: 'Retail Management Professional', year: 2023 },
      { name: 'Leadership Excellence', year: 2022 },
      { name: 'Inventory Control Specialist', year: 2021 }
    ]
  }), []);

  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getManagerProfile();
        setProfile({
          ...defaultProfile,
          ...data,
          joinDate: data.joinDate ? new Date(data.joinDate) : defaultProfile.joinDate
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [defaultProfile]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-header-banner">
        <div className="profile-header-content">
          <div className="profile-avatar">
            {profile.name.charAt(0)}
          </div>
          <div className="profile-title">
            <h1>{profile.name}</h1>
            <div className="profile-badges">
              <span className="badge designation">{profile.designation}</span>
              <span className="badge department">{profile.department}</span>
              <span className="badge id">ID: {profile.employeeId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card personal-info">
          <h2>Professional Details</h2>
          <div className="info-grid">
            <div className="info-item">
              <i className="fas fa-envelope"></i>
              <label>Email</label>
              <span>{profile.email || 'N/A'}</span>
            </div>
            <div className="info-item">
              <i className="fas fa-phone"></i>
              <label>Phone</label>
              <span>{profile.phone || 'N/A'}</span>
            </div>
            <div className="info-item">
              <i className="fas fa-calendar"></i>
              <label>Join Date</label>
              <span>{formatDate(profile.joinDate)}</span>
            </div>
            <div className="info-item">
              <i className="fas fa-users"></i>
              <label>Team Size</label>
              <span>{profile.teamSize || 0} members</span>
            </div>
          </div>
        </div>

        <div className="profile-card stats-overview">
          <h2>Management Overview</h2>
          <div className="stats-grid">
            <div className="stat-card products">
              <i className="fas fa-box"></i>
              <div className="stat-content">
                <h3>Products Managed</h3>
                <p>{profile.productsManaged}</p>
              </div>
            </div>
            <div className="stat-card orders">
              <i className="fas fa-shopping-cart"></i>
              <div className="stat-content">
                <h3>Orders Processed</h3>
                <p>{profile.ordersProcessed}</p>
              </div>
            </div>
            <div className="stat-card revenue">
              <i className="fas fa-chart-line"></i>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p>₹{profile.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card skills">
          <h2>Expertise & Certifications</h2>
          <div className="skills-grid">
            <div className="expertise-tags">
              {profile.expertise.map((skill, index) => (
                <span key={index} className="expertise-tag">{skill}</span>
              ))}
            </div>
            <div className="certifications-list">
              {profile.certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <i className="fas fa-certificate"></i>
                  <div className="cert-details">
                    <span className="cert-name">{cert.name}</span>
                    <span className="cert-year">{cert.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;