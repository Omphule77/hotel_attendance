import json
import subprocess

def query_json(sql):
    cmd = [
        r'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe',
        '-u', 'root',
        '-pOmphule13@',
        '--default-character-set=utf8mb4',
        'hotel_attendance',
        '-N',
        '-e', sql
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
    text = res.stdout.strip()
    if text:
        return json.loads(text)
    return []

admins_sql = "SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'username', username, 'password', password, 'full_name', full_name, 'hotel_name', hotel_name, 'mobile', mobile, 'created_at', created_at)) FROM admins;"
employees_sql = "SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'name', name, 'mobile', mobile, 'role', role, 'salary_type', salary_type, 'salary_amount', salary_amount, 'per_hour_rate', per_hour_rate, 'joining_date', joining_date, 'status', status, 'address', address, 'created_at', created_at, 'updated_at', updated_at)) FROM employees;"
attendance_sql = "SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'employee_id', employee_id, 'attendance_date', attendance_date, 'status', status, 'hours_worked', hours_worked, 'notes', notes, 'created_at', created_at, 'updated_at', updated_at)) FROM attendance;"
advances_sql = "SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'employee_id', employee_id, 'advance_date', advance_date, 'amount', amount, 'reason', reason, 'created_at', created_at)) FROM salary_advances;"

data = {
    'admins': query_json(admins_sql),
    'employees': query_json(employees_sql),
    'attendance': query_json(attendance_sql),
    'salary_advances': query_json(advances_sql)
}

with open('migration/mysql_exported_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("SUCCESS: Exported", len(data['admins']), "admins,", len(data['employees']), "employees,", len(data['attendance']), "attendance records,", len(data['salary_advances']), "advances.")
