import React, { useState } from 'react';
import { Hotel, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/api';

export default function LoginPage({ onLoginSuccess, switchToRegister, showToast }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      showToast('कृपया युझरनेम आणि पासवर्ड भरा', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login(username, password);
      showToast(res.message || 'लॉगिन यशस्वी झाले!', 'success');
      onLoginSuccess(res.data);
    } catch (err) {
      showToast(err.message || 'लॉगिन करताना त्रुटी आली. पुन्हा प्रयत्न करा.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div style={{ display: 'inline-flex', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '0.8rem' }}>
            <Hotel size={40} color="#fbbf24" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.2rem' }}>
            हॉटेल कर्मचारी हजेरी प्रणाली
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
            व्यवस्थापक लॉगिन (Hotel Admin Portal)
          </p>
        </div>

        {/* Form Body */}
        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                युझरनेम किंवा ईमेल (Username)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="username"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="आपले युझरनेम किंवा ईमेल प्रविष्ट करा"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                पासवर्ड (Password)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="आपला पासवर्ड प्रविष्ट करा"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button
              id="login-btn"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
              disabled={loading}
            >
              <span>{loading ? 'लॉगिन होत आहे...' : 'लॉगिन करा (Login)'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Switch to Register */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>नवीन हॉटेल खाते उघडायचे आहे का? </span>
            <button
              id="goto-register-btn"
              type="button"
              onClick={switchToRegister}
              style={{ background: 'none', border: 'none', color: '#d97706', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              येथे नोंदणी करा (Register)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
