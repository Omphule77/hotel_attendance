import React, { useState } from 'react';
import { Hotel, Lock, User, Phone, Building2, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';

export default function RegisterPage({ onRegisterSuccess, switchToLogin, showToast }) {
  const [formData, setFormData] = useState({
    hotelName: '',
    fullName: '',
    mobile: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hotelName || !formData.username || !formData.password) {
      showToast('कृपया हॉटेलचे नाव, युझरनेम आणि पासवर्ड भरा', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register(formData);
      showToast(res.message || 'नोंदणी यशस्वी झाली! आता लॉगिन करा.', 'success');
      onRegisterSuccess(res.data);
    } catch (err) {
      showToast(err.message || 'नोंदणी करताना त्रुटी आली.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <div style={{ display: 'inline-flex', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '0.8rem' }}>
            <Building2 size={38} color="#fbbf24" />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.2rem' }}>
            नवीन हॉटेल नोंदणी (Hotel Registration)
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
            हॉटेल कर्मचारी व्यवस्थापनासाठी नोंदणी करा
          </p>
        </div>

        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="hotelName">हॉटेलचे नाव (Hotel Name) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="hotelName"
                  name="hotelName"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="उदा. हॉटेल मराठा / हॉटेल स्वागत"
                  value={formData.hotelName}
                  onChange={handleChange}
                  required
                />
                <Hotel size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fullName">व्यवस्थापकाचे पूर्ण नाव (Manager Name)</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="उदा. ओमकार फडतारे"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mobile">मोबाईल नंबर (Mobile Number)</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="उदा. 9822000000"
                  value={formData.mobile}
                  onChange={handleChange}
                />
                <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">लॉगिन युझरनेम (Username) *</label>
              <input
                id="reg-username"
                name="username"
                type="text"
                className="form-input"
                placeholder="उदा. hotelmaratha किंवा admin"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">पासवर्ड (Password) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="किमान ६ अक्षरी पासवर्ड"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button
              id="register-btn"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.2rem', padding: '0.8rem' }}
              disabled={loading}
            >
              <span>{loading ? 'नोंदणी होत आहे...' : 'खाते तयार करा (Register Now)'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>आधीच खाते आहे का? </span>
            <button
              id="goto-login-btn"
              type="button"
              onClick={switchToLogin}
              style={{ background: 'none', border: 'none', color: '#d97706', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              येथे लॉगिन करा (Login)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
