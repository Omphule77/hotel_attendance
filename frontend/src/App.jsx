import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AttendancePage from './pages/AttendancePage';
import EmployeeListPage from './pages/EmployeeListPage';
import MonthlySalaryPage from './pages/MonthlySalaryPage';
import { authService } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [activePage, setActivePage] = useState('attendance'); // 'attendance', 'employees', 'monthly'
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActivePage('attendance');
  };

  const handleRegisterSuccess = (user) => {
    setCurrentUser(user);
    setActivePage('attendance');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setAuthView('login');
    showToast('यशस्वीरित्या बाहेर पडला आहात.', 'info');
  };

  // जर वापरकर्ता लॉगिन नसेल तर लॉगिन किंवा रजिस्टर स्क्रीन दाखवा
  if (!currentUser) {
    return (
      <>
        {authView === 'login' ? (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            switchToRegister={() => setAuthView('register')}
            showToast={showToast}
          />
        ) : (
          <RegisterPage
            onRegisterSuccess={handleRegisterSuccess}
            switchToLogin={() => setAuthView('login')}
            showToast={showToast}
          />
        )}
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      </>
    );
  }

  // लॉगिन झाल्यानंतर मुख्य ऍप्लिकेशन
  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Pages */}
      <main className="main-content">
        {activePage === 'attendance' && (
          <AttendancePage showToast={showToast} />
        )}

        {activePage === 'employees' && (
          <EmployeeListPage showToast={showToast} />
        )}

        {activePage === 'monthly' && (
          <MonthlySalaryPage currentUser={currentUser} showToast={showToast} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '1.2rem', color: '#64748b', fontSize: '0.85rem', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }} className="no-print">
        हॉटेल कर्मचारी व वेटर हजेरी व्यवस्थापन प्रणाली • सर्व हक्क राखीव © {new Date().getFullYear()}
      </footer>

      {/* Notification Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
