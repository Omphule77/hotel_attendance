import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, Calendar, Check, X, Clock, Save, 
  ChevronLeft, ChevronRight, UserCheck, AlertCircle, Sparkles, MessageSquare
} from 'lucide-react';
import { attendanceService } from '../services/api';

export default function AttendancePage({ showToast }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // दिलेल्या तारखेची हजेरी लोड करा
  const loadAttendance = async (dateStr) => {
    setLoading(true);
    try {
      const data = await attendanceService.getDaily(dateStr);
      setRecords(data);
    } catch (err) {
      showToast('हजेरी लोड करताना त्रुटी आली.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance(selectedDate);
  }, [selectedDate]);

  // एका क्लिकवर हजेरी बदलणे (Click to toggle Present / Absent / Half Day)
  const handleStatusChange = (empId, newStatus) => {
    setRecords(prev => prev.map(rec => {
      if (rec.employeeId === empId) {
        let hours = 8.0;
        if (newStatus === 'HALF_DAY') hours = 4.0;
        else if (newStatus === 'ABSENT') hours = 0.0;
        return { ...rec, status: newStatus, hoursWorked: hours };
      }
      return rec;
    }));
  };

  // कामाचे तास बदलणे
  const handleHoursChange = (empId, val) => {
    const num = parseFloat(val) || 0;
    setRecords(prev => prev.map(rec => {
      if (rec.employeeId === empId) {
        return { ...rec, hoursWorked: num };
      }
      return rec;
    }));
  };

  // शेरा / टिप बदलणे
  const handleNotesChange = (empId, notes) => {
    setRecords(prev => prev.map(rec => {
      if (rec.employeeId === empId) {
        return { ...rec, notes };
      }
      return rec;
    }));
  };

  // सर्व हजर करा (Mark All Present)
  const handleMarkAllPresent = () => {
    setRecords(prev => prev.map(rec => ({ ...rec, status: 'PRESENT', hoursWorked: 8.0 })));
    showToast('सर्व कर्मचाऱ्यांना हजर केले!', 'info');
  };

  // सर्व गैरहजर करा (Mark All Absent)
  const handleMarkAllAbsent = () => {
    setRecords(prev => prev.map(rec => ({ ...rec, status: 'ABSENT', hoursWorked: 0.0 })));
    showToast('सर्व कर्मचाऱ्यांना गैरहजर केले!', 'info');
  };

  // तारीख पुढे/मागे करणे (Previous/Next day)
  const handleDateShift = (days) => {
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + days);
    setSelectedDate(curr.toISOString().split('T')[0]);
  };

  // हजेरी सेव्ह करा
  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      await attendanceService.saveBulk(selectedDate, records);
      showToast('आजची हजेरी यशस्वीरित्या सेव्ह झाली!', 'success');
    } catch (err) {
      showToast('हजेरी सेव्ह करताना त्रुटी आली.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // आकडेवारी (Stats calculation)
  const totalEmployees = records.length;
  const presentCount = records.filter(r => r.status === 'PRESENT').length;
  const absentCount = records.filter(r => r.status === 'ABSENT').length;
  const halfDayCount = records.filter(r => r.status === 'HALF_DAY').length;

  // मराठी तारीख स्वरूप (Marathi formatted date)
  const getFormattedMarathiDate = (dateStr) => {
    try {
      const parts = dateStr.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('mr-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <CalendarCheck size={28} color="#10b981" />
            <span>दैनिक हजेरी नोंदणी पत्रक (Daily Attendance)</span>
          </h2>
          <p className="page-subtitle">
            कर्मचाऱ्यांच्या नावापुढे फक्त 'हजर' किंवा 'गैरहजर' वर क्लिक करा आणि सेव्ह करा
          </p>
        </div>

        {/* Date Selector & Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => handleDateShift(-1)}
            title="मागील दिवस"
          >
            <ChevronLeft size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={18} color="#d97706" />
            <input
              id="attendance-date-input"
              type="date"
              className="form-input"
              style={{ padding: '0.35rem 0.5rem', width: 'auto', border: 'none', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => handleDateShift(1)}
            title="पुढील दिवस"
          >
            <ChevronRight size={16} />
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            title="आजच्या तारखेवर जा"
            style={{ fontWeight: '600' }}
          >
            आज
          </button>
        </div>
      </div>

      {/* Date Display Pill */}
      <div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div style={{ background: '#fef3c7', color: '#b45309', padding: '0.4rem 1rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem', border: '1px solid #fde68a' }}>
          तारीख: {getFormattedMarathiDate(selectedDate)}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            id="mark-all-present-btn"
            className="btn btn-secondary btn-sm"
            onClick={handleMarkAllPresent}
            style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}
          >
            <Check size={16} />
            <span>सर्व हजर करा</span>
          </button>
          <button
            id="mark-all-absent-btn"
            className="btn btn-secondary btn-sm"
            onClick={handleMarkAllAbsent}
            style={{ background: '#fef2f2', color: '#991b1b', borderColor: '#fecaca' }}
          >
            <X size={16} />
            <span>सर्व गैरहजर करा</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalEmployees}</div>
            <div className="stat-label">एकूण कर्मचारी</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon present">
            <Check size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#10b981' }}>{presentCount}</div>
            <div className="stat-label">आज हजर (Present)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon absent">
            <X size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#ef4444' }}>{absentCount}</div>
            <div className="stat-label">आज गैरहजर (Absent)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon half">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#f59e0b' }}>{halfDayCount}</div>
            <div className="stat-label">अर्धा दिवस (Half Day)</div>
          </div>
        </div>
      </div>

      {/* Vertical Attendance Filling List (Exact user specification) */}
      <div className="attendance-list">
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            हजेरी पत्रक लोड होत आहे...
          </div>
        ) : records.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            कोणतेही कर्मचारी उपलब्ध नाहीत. कृपया आधी 'कर्मचारी व्यवस्थापन' टॅबमध्ये जाऊन कर्मचारी जोडा.
          </div>
        ) : (
          records.map((rec) => {
            const cardStatusClass = 
              rec.status === 'PRESENT' ? 'status-present' :
              rec.status === 'ABSENT' ? 'status-absent' : 'status-half';

            return (
              <div key={rec.employeeId} className={`attendance-card ${cardStatusClass}`}>
                {/* 1. Employee Info Column */}
                <div className="emp-profile-col">
                  <div className="emp-avatar">
                    {rec.employeeName ? rec.employeeName.charAt(0) : 'E'}
                  </div>
                  <div>
                    <div className="emp-details-title">{rec.employeeName}</div>
                    <div className="emp-details-sub">
                      <span className="role-badge">{rec.role || 'वेटर'}</span>
                      <span className="salary-tag">
                        ₹{Number(rec.salaryAmount).toLocaleString('en-IN')}
                        {rec.salaryType === 'DAILY' ? '/दिवस' : '/महिना'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Direct Attendance Click Buttons Column */}
                <div className="attendance-actions-col">
                  {/* हजर (Present) Button */}
                  <button
                    type="button"
                    className={`status-toggle-btn btn-is-present ${rec.status === 'PRESENT' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(rec.employeeId, 'PRESENT')}
                  >
                    <Check size={18} />
                    <span>हजर</span>
                  </button>

                  {/* अर्धा दिवस (Half Day) Button */}
                  <button
                    type="button"
                    className={`status-toggle-btn btn-is-half ${rec.status === 'HALF_DAY' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(rec.employeeId, 'HALF_DAY')}
                  >
                    <Clock size={16} />
                    <span>अर्धा दिवस</span>
                  </button>

                  {/* गैरहजर (Absent) Button */}
                  <button
                    type="button"
                    className={`status-toggle-btn btn-is-absent ${rec.status === 'ABSENT' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(rec.employeeId, 'ABSENT')}
                  >
                    <X size={18} />
                    <span>गैरहजर</span>
                  </button>
                </div>

                {/* 3. Hours and Notes Column */}
                <div className="emp-hours-col">
                  <div className="hours-input-wrapper">
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>तास:</span>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      className="hours-input"
                      value={rec.hoursWorked ?? 8}
                      onChange={(e) => handleHoursChange(rec.employeeId, e.target.value)}
                      title="कामाचे एकूण तास"
                    />
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>तास</span>
                  </div>

                  <input
                    type="text"
                    className="form-input"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', borderRadius: '4px' }}
                    placeholder="शेरा (टिप)..."
                    value={rec.notes || ''}
                    onChange={(e) => handleNotesChange(rec.employeeId, e.target.value)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating or Bottom Save Bar */}
      {records.length > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', background: '#ffffff', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
          <button
            id="save-daily-attendance-btn"
            className="btn btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}
            onClick={handleSaveAttendance}
            disabled={saving}
          >
            <Save size={20} />
            <span>{saving ? 'हजेरी सेव्ह होत आहे...' : 'आजची हजेरी सेव्ह करा (Save Attendance)'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
