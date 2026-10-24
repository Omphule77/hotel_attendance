import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, Calendar, IndianRupee, Printer, 
  Eye, PlusCircle, CheckCircle2, TrendingUp, AlertTriangle, Download
} from 'lucide-react';
import { salaryService } from '../services/api';
import SalarySlipModal from '../components/SalarySlipModal';

const MARATHI_MONTHS = [
  { value: 1, label: 'जानेवारी (January)' },
  { value: 2, label: 'फेब्रुवारी (February)' },
  { value: 3, label: 'मार्च (March)' },
  { value: 4, label: 'एप्रिल (April)' },
  { value: 5, label: 'मे (May)' },
  { value: 6, label: 'जून (June)' },
  { value: 7, label: 'जुलै (July)' },
  { value: 8, label: 'ऑगस्ट (August)' },
  { value: 9, label: 'सप्टेंबर (September)' },
  { value: 10, label: 'ऑक्टोबर (October)' },
  { value: 11, label: 'नोव्हेंबर (November)' },
  { value: 12, label: 'डिसेंबर (December)' }
];

export default function MonthlySalaryPage({ currentUser, showToast }) {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected Employee for Salary Slip Modal
  const [activeSlipData, setActiveSlipData] = useState(null);

  // Advance Modal State
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [selectedEmpForAdvance, setSelectedEmpForAdvance] = useState(null);
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceReason, setAdvanceReason] = useState('घरगुती खर्च');

  const loadMonthlyReport = async (year, month) => {
    setLoading(true);
    try {
      const data = await salaryService.getMonthlyReport(year, month);
      setReportData(data);
    } catch (err) {
      showToast('मासिक अहवाल लोड करताना त्रुटी आली.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonthlyReport(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const handleOpenAdvanceModal = (emp) => {
    setSelectedEmpForAdvance(emp);
    setAdvanceAmount('');
    setAdvanceReason('मासिक उचल');
    setShowAdvanceModal(true);
  };

  const handleSaveAdvance = async (e) => {
    e.preventDefault();
    if (!advanceAmount || Number(advanceAmount) <= 0) {
      showToast('कृपया योग्य रक्कम प्रविष्ट करा', 'error');
      return;
    }

    try {
      await salaryService.addAdvance({
        employeeId: selectedEmpForAdvance.employeeId,
        amount: Number(advanceAmount),
        reason: advanceReason,
        advanceDate: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`
      });
      showToast(`${selectedEmpForAdvance.employeeName} साठी ₹${advanceAmount} उचल नोंदवली गेली!`, 'success');
      setShowAdvanceModal(false);
      loadMonthlyReport(selectedYear, selectedMonth);
    } catch (err) {
      showToast('उचल नोंदवताना त्रुटी आली.', 'error');
    }
  };

  // Summaries
  const totalEmployees = reportData.length;
  const totalNetSalary = reportData.reduce((sum, r) => sum + Number(r.finalSalary || 0), 0);
  const totalAdvanceDeduction = reportData.reduce((sum, r) => sum + Number(r.advanceDeduction || 0), 0);
  const monthName = MARATHI_MONTHS.find(m => m.value === Number(selectedMonth))?.label || '';

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <FileSpreadsheet size={28} color="#d97706" />
            <span>मासिक हजेरी व अंतिम पगार अहवाल (Monthly Attendance & Salary)</span>
          </h2>
          <p className="page-subtitle">
            प्रत्येक कर्मचाऱ्याचे महिनाभरातील हजर/गैरहजर दिवस, उचल आणि अंतिम पगार गणना
          </p>
        </div>

        {/* Month & Year Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <select
            id="select-month"
            className="form-select"
            style={{ width: 'auto', fontWeight: '600' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {MARATHI_MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <select
            id="select-year"
            className="form-select"
            style={{ width: 'auto', fontWeight: '600' }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button
            className="btn btn-secondary"
            onClick={() => window.print()}
            title="संपूर्ण अहवाल प्रिंट करा"
          >
            <Printer size={18} />
            <span>प्रिंट अहवाल</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{new Date(selectedYear, selectedMonth, 0).getDate()} दिवस</div>
            <div className="stat-label">{monthName} एकूण दिवस</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon salary">
            <IndianRupee size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#047857' }}>
              ₹{totalNetSalary.toLocaleString('en-IN')}
            </div>
            <div className="stat-label">एकूण वाटप होणारा पगार (Total Net Pay)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon absent">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#dc2626' }}>
              ₹{totalAdvanceDeduction.toLocaleString('en-IN')}
            </div>
            <div className="stat-label">एकूण उचल वजावट (Advances)</div>
          </div>
        </div>
      </div>

      {/* Main Salary Table */}
      <div className="card" style={{ padding: '0.5rem' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>कर्मचाऱ्याचे नाव</th>
                <th>पद</th>
                <th>पगार प्रकार व दर</th>
                <th style={{ color: '#059669', textAlign: 'center' }}>हजर दिवस</th>
                <th style={{ color: '#d97706', textAlign: 'center' }}>अर्धा दिवस</th>
                <th style={{ color: '#dc2626', textAlign: 'center' }}>गैरहजर</th>
                <th style={{ textAlign: 'center' }}>एकूण तास</th>
                <th style={{ textAlign: 'right' }}>हजेरीनुसार पगार (₹)</th>
                <th style={{ textAlign: 'right', color: '#dc2626' }}>उचल (₹)</th>
                <th style={{ textAlign: 'right', color: '#15803d' }}>अंतिम पगार (₹)</th>
                <th style={{ textAlign: 'center' }}>पावती (Slip)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    मासिक पगार डेटा लोड होत आहे...
                  </td>
                </tr>
              ) : reportData.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    या महिन्यासाठी कोणताही कर्मचारी रेकॉर्ड आढळला नाही.
                  </td>
                </tr>
              ) : (
                reportData.map((row, index) => (
                  <tr key={row.employeeId}>
                    <td style={{ color: '#94a3b8', fontWeight: '600' }}>{index + 1}</td>
                    <td>
                      <div>
                        <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{row.employeeName}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{row.mobile}</div>
                      </div>
                    </td>
                    <td>
                      <span className="role-badge">{row.role}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>
                        <strong>₹{Number(row.baseSalary).toLocaleString('en-IN')}</strong>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {row.salaryType === 'DAILY' ? ' /दिवस' : ' /महिना'}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ background: '#ecfdf5', color: '#065f46', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: '700' }}>
                        {row.presentDays}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ background: '#fffbeb', color: '#92400e', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: '700' }}>
                        {row.halfDays}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ background: '#fef2f2', color: '#991b1b', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: '700' }}>
                        {row.absentDays}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', color: '#475569', fontWeight: '600' }}>
                      {row.totalHoursWorked} तास
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      ₹{Number(row.grossSalary).toLocaleString('en-IN')}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <span style={{ color: Number(row.advanceDeduction) > 0 ? '#dc2626' : '#64748b', fontWeight: '600' }}>
                          ₹{Number(row.advanceDeduction).toLocaleString('en-IN')}
                        </span>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                          onClick={() => handleOpenAdvanceModal(row)}
                          title="उचल / अ‍ॅडव्हान्स जोडा"
                        >
                          + उचल
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="salary-highlight">
                        ₹{Number(row.finalSalary).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveSlipData(row)}
                        title="पगार स्लिप पाहा व प्रिंट करा"
                      >
                        <Eye size={14} />
                        <span>स्लिप</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advance Modal */}
      {showAdvanceModal && selectedEmpForAdvance && (
        <div className="modal-overlay" onClick={() => setShowAdvanceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <div className="modal-title">उचल (Advance) नोंदवा</div>
              <button className="modal-close" onClick={() => setShowAdvanceModal(false)}>×</button>
            </div>
            <form onSubmit={handleSaveAdvance}>
              <div className="modal-body">
                <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>कर्मचारी: </span>
                  <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{selectedEmpForAdvance.employeeName}</strong>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="adv-amount">उचल रक्कम (रुपये) *</label>
                  <input
                    id="adv-amount"
                    type="number"
                    min="1"
                    className="form-input"
                    placeholder="उदा. 500 किंवा 1000"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="adv-reason">कारण / शेरा</label>
                  <input
                    id="adv-reason"
                    type="text"
                    className="form-input"
                    placeholder="उदा. घरगुती खर्च / सणासाठी उचल"
                    value={advanceReason}
                    onChange={(e) => setAdvanceReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAdvanceModal(false)}>
                  रद्द करा
                </button>
                <button type="submit" className="btn btn-primary">
                  उचल सेव्ह करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salary Slip Modal */}
      {activeSlipData && (
        <SalarySlipModal
          data={activeSlipData}
          hotelName={currentUser?.hotelName}
          monthYearText={`${monthName} ${selectedYear}`}
          onClose={() => setActiveSlipData(null)}
        />
      )}
    </div>
  );
}
