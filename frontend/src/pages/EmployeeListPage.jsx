import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Search, Trash2, Edit3, Phone, Calendar, IndianRupee, ShieldCheck } from 'lucide-react';
import { employeeService } from '../services/api';

export default function EmployeeListPage({ showToast }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    role: 'वेटर (Waiter)',
    salaryType: 'DAILY',
    salaryAmount: '',
    perHourRate: '',
    joiningDate: new Date().toISOString().split('T')[0],
    address: ''
  });

  const [editingId, setEditingId] = useState(null);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      showToast('कर्मचाऱ्यांची माहिती लोड करताना त्रुटी', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // जर दररोजचा पगार टाकला तर अंदाजे प्रति तास दर (८ तासांसाठी) आपोआप काढणे
      if (name === 'salaryAmount' && updated.salaryType === 'DAILY' && value) {
        updated.perHourRate = (parseFloat(value) / 8).toFixed(2);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim() || !formData.salaryAmount) {
      showToast('कृपया सर्व आवश्यक माहिती भरा (नाव, मोबाईल आणि पगार)', 'error');
      return;
    }

    try {
      if (editingId) {
        await employeeService.update(editingId, formData);
        showToast('कर्मचाऱ्याची माहिती अपडेट झाली!', 'success');
        setEditingId(null);
      } else {
        await employeeService.create(formData);
        showToast('नवीन कर्मचारी यशस्वीरित्या जोडला गेला!', 'success');
      }
      setShowAddForm(false);
      resetForm();
      loadEmployees();
    } catch (err) {
      showToast('माहिती सेव्ह करताना त्रुटी आली.', 'error');
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      name: emp.name,
      mobile: emp.mobile,
      role: emp.role,
      salaryType: emp.salaryType,
      salaryAmount: emp.salaryAmount,
      perHourRate: emp.perHourRate || '',
      joiningDate: emp.joiningDate || new Date().toISOString().split('T')[0],
      address: emp.address || ''
    });
    setEditingId(emp.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`तुम्हाला नक्की '${name}' या कर्मचाऱ्याला हटवायचे आहे का?`)) {
      try {
        await employeeService.delete(id);
        showToast('कर्मचारी हटवला गेला!', 'success');
        loadEmployees();
      } catch (err) {
        showToast('कर्मचारी हटवताना त्रुटी आली', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      role: 'वेटर (Waiter)',
      salaryType: 'DAILY',
      salaryAmount: '',
      perHourRate: '',
      joiningDate: new Date().toISOString().split('T')[0],
      address: ''
    });
    setEditingId(null);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.mobile?.includes(searchTerm) ||
    emp.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <Users size={28} color="#d97706" />
            <span>हॉटेल कर्मचारी व्यवस्थापन (Staff Management)</span>
          </h2>
          <p className="page-subtitle">
            वेटर, आचारी आणि इतर कर्मचाऱ्यांची नोंदणी, पगार प्रकार व माहिती व्यवस्थापन
          </p>
        </div>

        <button
          id="toggle-add-emp-btn"
          className="btn btn-primary"
          onClick={() => {
            if (showAddForm) resetForm();
            setShowAddForm(!showAddForm);
          }}
        >
          <UserPlus size={18} />
          <span>{showAddForm ? 'फॉर्म बंद करा' : '+ नवीन कर्मचारी जोडा'}</span>
        </button>
      </div>

      {/* Add / Edit Form Modal or Card */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '5px solid #d97706' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: '#b45309' }}>
            {editingId ? 'कर्मचारी माहिती संपादन (Edit Employee)' : 'नवीन कर्मचारी नोंदणी (Add New Employee)'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">कर्मचाऱ्याचे नाव (Full Name) *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="उदा. गणेश शिंदे / सचिन पवार"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Mobile */}
              <div className="form-group">
                <label className="form-label" htmlFor="mobile">मोबाईल नंबर (Mobile Number) *</label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  className="form-input"
                  placeholder="उदा. 9822001122"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Role / पद */}
              <div className="form-group">
                <label className="form-label" htmlFor="role">पद / भूमिका (Designation) *</label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="मुख्य वेटर (Captain)">मुख्य वेटर (Captain)</option>
                  <option value="वेटर (Waiter)">वेटर (Waiter)</option>
                  <option value="मुख्य आचारी (Head Chef)">मुख्य आचारी (Head Chef)</option>
                  <option value="आचारी / कुक (Cook)">आचारी / कुक (Cook)</option>
                  <option value="मदतनीस / किचन हेल्पर">मदतनीस / किचन हेल्पर</option>
                  <option value="स्वच्छता कर्मचारी (Cleaner)">स्वच्छता कर्मचारी (Cleaner)</option>
                  <option value="कॅशियर (Cashier)">कॅशियर (Cashier)</option>
                  <option value="व्यवस्थापक (Manager)">व्यवस्थापक (Manager)</option>
                </select>
              </div>

              {/* Salary Type (दररोज किंवा मासिक) */}
              <div className="form-group">
                <label className="form-label" htmlFor="salaryType">पगार प्रकार (Salary Type) *</label>
                <select
                  id="salaryType"
                  name="salaryType"
                  className="form-select"
                  value={formData.salaryType}
                  onChange={handleInputChange}
                >
                  <option value="DAILY">दररोजचा पगार (Per Day Salary)</option>
                  <option value="MONTHLY">मासिक पगार (Monthly Salary)</option>
                </select>
              </div>

              {/* Salary Amount */}
              <div className="form-group">
                <label className="form-label" htmlFor="salaryAmount">
                  {formData.salaryType === 'DAILY' ? 'दररोजचा पगार दर (₹/दिवस) *' : 'मासिक पगार रक्कम (₹/महिना) *'}
                </label>
                <input
                  id="salaryAmount"
                  name="salaryAmount"
                  type="number"
                  min="0"
                  step="1"
                  className="form-input"
                  placeholder={formData.salaryType === 'DAILY' ? 'उदा. 500' : 'उदा. 18000'}
                  value={formData.salaryAmount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Per Hour Rate */}
              <div className="form-group">
                <label className="form-label" htmlFor="perHourRate">
                  प्रति तास दर (₹/तास) (ऐच्छिक)
                </label>
                <input
                  id="perHourRate"
                  name="perHourRate"
                  type="number"
                  min="0"
                  step="0.5"
                  className="form-input"
                  placeholder="उदा. 60"
                  value={formData.perHourRate}
                  onChange={handleInputChange}
                />
              </div>

              {/* Joining Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="joiningDate">सामील झाल्याची तारीख (Joining Date)</label>
                <input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  className="form-input"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                />
              </div>

              {/* Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="address">गावाचे नाव / पत्ता (Address)</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="form-input"
                  placeholder="उदा. पुणे / सातारा / कोल्हापूर"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
                रद्द करा
              </button>
              <button type="submit" className="btn btn-primary" id="save-employee-btn">
                <span>{editingId ? 'माहिती अपडेट करा' : 'कर्मचारी जोडा (Save)'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Stats Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="नाव, पद किंवा मोबाईलने शोधा..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div style={{ fontSize: '0.95rem', color: '#475569', fontWeight: '600' }}>
          एकूण कर्मचारी: <span style={{ color: '#d97706', fontSize: '1.1rem' }}>{filteredEmployees.length}</span>
        </div>
      </div>

      {/* Employees Table */}
      <div className="card" style={{ padding: '0.5rem' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>कर्मचाऱ्याचे नाव</th>
                <th>पद / काम</th>
                <th>मोबाईल नंबर</th>
                <th>पगार प्रकार</th>
                <th>दर / पगार (₹)</th>
                <th>प्रति तास दर (₹)</th>
                <th>सामील तारीख</th>
                <th style={{ textAlign: 'center' }}>कृती (Actions)</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    कोणताही कर्मचारी सापडला नाही. "+ नवीन कर्मचारी जोडा" वर क्लिक करून नवीन कर्मचारी जोडा.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td style={{ color: '#94a3b8', fontWeight: '600' }}>{index + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div className="emp-avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '1rem' }}>{emp.name}</strong>
                          {emp.address && <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{emp.address}</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="role-badge">{emp.role}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}>
                        <Phone size={14} />
                        <span>{emp.mobile}</span>
                      </div>
                    </td>
                    <td>
                      <span className="salary-tag">
                        {emp.salaryType === 'DAILY' ? 'दररोज (Daily)' : 'मासिक (Monthly)'}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#0f172a' }}>
                        ₹{Number(emp.salaryAmount).toLocaleString('en-IN')}
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'normal' }}>
                          {emp.salaryType === 'DAILY' ? ' /दिवस' : ' /महिना'}
                        </span>
                      </strong>
                    </td>
                    <td>
                      <span style={{ color: '#64748b' }}>
                        {emp.perHourRate ? `₹${emp.perHourRate}/तास` : '-'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#64748b' }}>
                        <Calendar size={13} />
                        <span>{emp.joiningDate || '-'}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEdit(emp)}
                          title="माहिती संपादन करा"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(emp.id, emp.name)}
                          title="कर्मचारी हटवा"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
