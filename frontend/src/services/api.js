// ======================================================================
// API सेवा (API Client Service for Hotel Attendance)
// ======================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// स्थानिक चाचणी डेटा (Fallback Local Data if backend is disconnected)
const LOCAL_STORAGE_KEY_EMPLOYEES = 'hotel_app_employees';
const LOCAL_STORAGE_KEY_ATTENDANCE = 'hotel_app_attendance';
const LOCAL_STORAGE_KEY_ADVANCES = 'hotel_app_advances';

const initialEmployees = [];

function getLocalEmployees() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_EMPLOYEES);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY_EMPLOYEES, JSON.stringify(initialEmployees));
    return initialEmployees;
  }
  return JSON.parse(data);
}

function setLocalEmployees(list) {
  localStorage.setItem(LOCAL_STORAGE_KEY_EMPLOYEES, JSON.stringify(list));
}

// ------------------- ऑथेंटिकेशन (Authentication) -------------------
export const authService = {
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('hotel_user', JSON.stringify(data.data));
        return data;
      }
      throw new Error(data.message || 'लॉगिन अयशस्वी');
    } catch (err) {
      throw err;
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data;
    } catch (err) {
      // Fallback
      const newAdmin = {
        id: Date.now(),
        username: userData.username,
        fullName: userData.fullName || 'व्यवस्थापक',
        hotelName: userData.hotelName || 'हॉटेल मराठा',
        mobile: userData.mobile || ''
      };
      localStorage.setItem('hotel_user', JSON.stringify(newAdmin));
      return { success: true, message: 'नोंदणी यशस्वी झाली!', data: newAdmin };
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('hotel_user');
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem('hotel_user');
  }
};

// ------------------- कर्मचारी सेवा (Employee API) -------------------
export const employeeService = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees`);
      const json = await res.json();
      if (json.success && json.data.length > 0) return json.data;
      return getLocalEmployees();
    } catch (err) {
      return getLocalEmployees();
    }
  },

  create: async (employee) => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      const json = await res.json();
      if (json.success) return json.data;
    } catch (e) {
      // offline fallback
    }
    const current = getLocalEmployees();
    const newEmp = { ...employee, id: Date.now(), status: 'ACTIVE' };
    current.push(newEmp);
    setLocalEmployees(current);
    return newEmp;
  },

  update: async (id, employee) => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      const json = await res.json();
      if (json.success) return json.data;
    } catch (e) {}

    const current = getLocalEmployees().map(e => e.id === id ? { ...e, ...employee } : e);
    setLocalEmployees(current);
    return employee;
  },

  delete: async (id) => {
    try {
      await fetch(`${API_BASE_URL}/employees/${id}`, { method: 'DELETE' });
    } catch (e) {}
    const current = getLocalEmployees().filter(e => e.id !== id);
    setLocalEmployees(current);
    return true;
  }
};

// ------------------- दैनिक हजेरी सेवा (Attendance API) -------------------
export const attendanceService = {
  getDaily: async (dateString) => {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/daily?date=${dateString}`);
      const json = await res.json();
      if (json.success && json.data.length > 0) return json.data;
    } catch (e) {}

    // Fallback using local storage
    const employees = getLocalEmployees();
    const allAtt = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ATTENDANCE) || '{}');
    const dayRecords = allAtt[dateString] || {};

    return employees.map(emp => {
      const existing = dayRecords[emp.id];
      return {
        employeeId: emp.id,
        employeeName: emp.name,
        mobile: emp.mobile,
        role: emp.role,
        salaryType: emp.salaryType,
        salaryAmount: emp.salaryAmount,
        perHourRate: emp.perHourRate,
        status: existing ? existing.status : 'PRESENT',
        hoursWorked: existing ? existing.hoursWorked : 8.0,
        notes: existing ? existing.notes : ''
      };
    });
  },

  saveBulk: async (dateString, records) => {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/bulk-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendanceDate: dateString, records })
      });
      const json = await res.json();
      if (json.success) return json.data;
    } catch (e) {}

    // Save locally
    const allAtt = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ATTENDANCE) || '{}');
    allAtt[dateString] = {};
    records.forEach(r => {
      allAtt[dateString][r.employeeId] = {
        status: r.status,
        hoursWorked: r.hoursWorked,
        notes: r.notes
      };
    });
    localStorage.setItem(LOCAL_STORAGE_KEY_ATTENDANCE, JSON.stringify(allAtt));
    return records;
  }
};

// ------------------- मासिक पगार व अहवाल सेवा (Monthly Salary API) -------------------
export const salaryService = {
  getMonthlyReport: async (year, month) => {
    try {
      const res = await fetch(`${API_BASE_URL}/salary/monthly?year=${year}&month=${month}`);
      const json = await res.json();
      if (json.success && json.data.length > 0) return json.data;
    } catch (e) {}

    // Local calculation fallback
    const employees = getLocalEmployees();
    const allAtt = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ATTENDANCE) || '{}');
    const advances = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ADVANCES) || '[]');

    const daysInMonth = new Date(year, month, 0).getDate();

    return employees.map(emp => {
      let presentDays = 0;
      let halfDays = 0;
      let absentDays = 0;
      let totalHours = 0;

      // Count for all days in month
      for (let d = 1; d <= daysInMonth; d++) {
        const dStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayRecord = allAtt[dStr] && allAtt[dStr][emp.id];
        if (dayRecord) {
          if (dayRecord.status === 'PRESENT') {
            presentDays += 1;
            totalHours += (dayRecord.hoursWorked || 8);
          } else if (dayRecord.status === 'HALF_DAY') {
            halfDays += 1;
            totalHours += (dayRecord.hoursWorked || 4);
          } else if (dayRecord.status === 'ABSENT') {
            absentDays += 1;
          }
        }
      }

      // Advance वजावट
      const empAdvances = advances.filter(a => a.employeeId === emp.id);
      const totalAdvance = empAdvances.reduce((sum, a) => sum + Number(a.amount || 0), 0);

      // Salary calculation
      let gross = 0;
      const base = Number(emp.salaryAmount || 0);

      if (emp.salaryType === 'DAILY') {
        gross = (presentDays * base) + (halfDays * base * 0.5);
      } else {
        const perDay = base / daysInMonth;
        gross = perDay * (presentDays + (halfDays * 0.5));
      }

      gross = Math.round(gross);
      const net = Math.max(0, gross - totalAdvance);

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        mobile: emp.mobile,
        role: emp.role,
        salaryType: emp.salaryType,
        baseSalary: base,
        perHourRate: emp.perHourRate,
        totalDaysInMonth: daysInMonth,
        presentDays,
        halfDays,
        absentDays,
        totalHoursWorked: totalHours,
        grossSalary: gross,
        advanceDeduction: totalAdvance,
        finalSalary: net
      };
    });
  },

  addAdvance: async (advanceData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/salary/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(advanceData)
      });
      const json = await res.json();
      if (json.success) return json.data;
    } catch (e) {}

    const advances = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ADVANCES) || '[]');
    advances.push({ ...advanceData, id: Date.now() });
    localStorage.setItem(LOCAL_STORAGE_KEY_ADVANCES, JSON.stringify(advances));
    return advanceData;
  }
};
