import React from 'react';
import { Printer, X, Hotel, Award } from 'lucide-react';

export default function SalarySlipModal({ data, hotelName, monthYearText, onClose }) {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header no-print">
          <div className="modal-title">मासिक पगार स्लिप / पावती</div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body printable-slip">
          {/* Slip Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '1rem', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <Hotel size={28} color="#d97706" />
              <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: '800' }}>
                {hotelName || 'हॉटेल राजमुद्रा & फॅमिली रेस्टॉरंट'}
              </h2>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>कर्मचारी मासिक पगार पावती</p>
            <div style={{ display: 'inline-block', background: '#fef3c7', color: '#b45309', padding: '0.2rem 0.8rem', borderRadius: '9999px', fontWeight: '600', fontSize: '0.85rem', marginTop: '0.4rem' }}>
              महिना: {monthYearText}
            </div>
          </div>

          {/* Employee Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>कर्मचाऱ्याचे नाव:</span>
              <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{data.employeeName}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>पद / भूमिका:</span>
              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{data.role}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>मोबाईल नंबर:</span>
              <strong>{data.mobile}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>पगार प्रकार व मूळ दर:</span>
              <strong>₹{data.baseSalary} ({data.salaryType === 'DAILY' ? 'दररोज' : 'मासिक'})</strong>
            </div>
          </div>

          {/* Attendance Breakdown */}
          <table className="data-table" style={{ marginBottom: '1.2rem', fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th>तपशील</th>
                <th style={{ textAlign: 'right' }}>दिवस / तास</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>महिना एकूण दिवस</td>
                <td style={{ textAlign: 'right', fontWeight: '600' }}>{data.totalDaysInMonth} दिवस</td>
              </tr>
              <tr>
                <td><span style={{ color: '#10b981', fontWeight: '600' }}>● पूर्ण हजर दिवस</span></td>
                <td style={{ textAlign: 'right', fontWeight: '600', color: '#10b981' }}>{data.presentDays} दिवस</td>
              </tr>
              <tr>
                <td><span style={{ color: '#f59e0b', fontWeight: '600' }}>● अर्धा दिवस हजर</span></td>
                <td style={{ textAlign: 'right', fontWeight: '600', color: '#f59e0b' }}>{data.halfDays} दिवस</td>
              </tr>
              <tr>
                <td><span style={{ color: '#ef4444', fontWeight: '600' }}>● गैरहजर दिवस</span></td>
                <td style={{ textAlign: 'right', fontWeight: '600', color: '#ef4444' }}>{data.absentDays} दिवस</td>
              </tr>
              <tr>
                <td>एकूण कामाचे तास</td>
                <td style={{ textAlign: 'right', fontWeight: '600' }}>{data.totalHoursWorked} तास</td>
              </tr>
            </tbody>
          </table>

          {/* Payment Calculation */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
              <span>हजेरीनुसार एकूण पगार:</span>
              <strong>₹{data.grossSalary?.toLocaleString('en-IN')}</strong>
            </div>
            {Number(data.advanceDeduction) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.95rem', color: '#dc2626' }}>
                <span>उचल / अ‍ॅडव्हान्स वजावट (-):</span>
                <strong>- ₹{data.advanceDeduction?.toLocaleString('en-IN')}</strong>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #86efac', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#166534' }}>अंतिम देय पगार (Net Pay):</span>
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#15803d' }}>
                ₹{data.finalSalary?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px dashed #94a3b8', width: '130px', margin: '0 auto 0.4rem' }}></div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>कर्मचाऱ्याची सही</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px dashed #94a3b8', width: '130px', margin: '0 auto 0.4rem' }}></div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>व्यवस्थापकाची सही व शिक्का</span>
            </div>
          </div>
        </div>

        <div className="modal-footer no-print">
          <button className="btn btn-secondary" onClick={onClose}>
            बंद करा
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={18} />
            <span>प्रिंट करा (Print Slip)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
