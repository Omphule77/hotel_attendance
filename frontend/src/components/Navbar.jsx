import React from 'react';
import { CalendarCheck, Users, FileSpreadsheet, LogOut, Hotel, UserCheck } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, currentUser, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Brand */}
        <div className="brand-section">
          <div className="brand-icon-box">
            <Hotel size={24} />
          </div>
          <div>
            <h1 className="brand-title">
              {currentUser?.hotelName || 'हॉटेल हजेरी प्रणाली'}
            </h1>
            <div className="brand-subtitle">कर्मचारी व वेटर हजेरी व्यवस्थापन</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-links">
          <button
            className={`nav-btn ${activePage === 'attendance' ? 'active' : ''}`}
            onClick={() => setActivePage('attendance')}
          >
            <CalendarCheck size={18} />
            <span>दैनिक हजेरी (Daily Attendance)</span>
          </button>

          <button
            className={`nav-btn ${activePage === 'employees' ? 'active' : ''}`}
            onClick={() => setActivePage('employees')}
          >
            <Users size={18} />
            <span>कर्मचारी व्यवस्थापन (Staff)</span>
          </button>

          <button
            className={`nav-btn ${activePage === 'monthly' ? 'active' : ''}`}
            onClick={() => setActivePage('monthly')}
          >
            <FileSpreadsheet size={18} />
            <span>मासिक पगार अहवाल (Monthly Salary)</span>
          </button>
        </div>

        {/* User Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div className="user-profile-badge">
            <UserCheck size={16} color="#fbbf24" />
            <span>{currentUser?.fullName || 'व्यवस्थापक'}</span>
          </div>
          <button className="logout-btn" onClick={onLogout} title="लॉगआउट करा">
            <LogOut size={16} />
            <span>बाहेर पडा</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
